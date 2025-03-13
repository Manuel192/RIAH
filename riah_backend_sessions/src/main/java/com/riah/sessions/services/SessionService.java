package com.riah.sessions.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.sessions.dao.SessionDAO;
import com.riah.sessions.model.Frame;
import com.riah.sessions.model.OperationDB;
import com.riah.sessions.model.Session;
import com.riah.sessions.model.SessionDB;
import com.riah.sessions.so.PythonService;
import com.riah.sessions.model.SessionDTO;

@Service
public class SessionService {
	
	@Autowired
	private OperationService operationService;
	
	@Autowired
	private SessionDAO sessionDAO;
	
	public SessionDTO loadSessionRawData(String id) throws ParseException {
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
		Session session= sessionDAO.loadSessionRawData(id);
		if(session==null) return null;
		
		SessionDTO parsedSession=new SessionDTO();
		for(int j=0;j<session.getData().size();j++) {
			String dataFrame=session.getData().get(j);
			dataFrame=dataFrame.replace("\"", "").replace("{","").replace("}","");
			List<String> data=List.of(dataFrame.split(", "));
			Frame frame=new Frame();
			for(int k=0;k<data.size();k++) {
				frame.addDataValue(data.get(k).split(":")[0], data.get(k).split(":")[1]);
				parsedSession.addDataType(data.get(k).split(":")[0]);
			}
			parsedSession.addFrame(frame);
		}
		return parsedSession;
	}

	public SessionDB loadSessionParameters(String id) throws ParseException {
		SessionDB session= sessionDAO.loadSessionParameters(id);
		if(session==null) return null;
		return session;
	}
	
	public void checkJSON(String session) {
		JSONObject json = new JSONObject(session);
		JSONArray frames=json.getJSONArray("frames");
		return;
	}

	public String insertSession(String session) {
		JSONObject json = new JSONObject(session);
		JSONArray frames=json.getJSONArray("frames");
		String[] parametersNames=JSONObject.getNames(frames.getJSONObject(0));
		Map<String,String[]> parameters=new HashMap<String,String[]>();
		for(int i=0;i<parametersNames.length;i++) {
			List<String> values=new ArrayList<String>();
			for(int j=0;j<frames.length();j++) {
				values.add(frames.getJSONObject(j).getString(parametersNames[i]));
			}
			parameters.put(parametersNames[i], values.toArray(new String[0]));
		}
		SessionDB sessionToInsert=new SessionDB(frames.toList(), parameters);
		SessionDB savedSession=sessionDAO.insertSession(sessionToInsert);
		return savedSession.get_id().toString(); 
	}

	public Map<String, String> calculateData(String sessionsParameters, String opId) throws ParseException {
		Map<String, String> results=new HashMap<>();
		JSONObject json = new JSONObject(sessionsParameters);
		JSONArray sessions=json.getJSONArray("sessions");
		OperationDB operation=operationService.loadOperation(opId);
		List<String> codeLines=operation.getCode();
		String basicCode="";
		for(int i=0;i<codeLines.size();i++)
			basicCode+=codeLines.get(i)+"\n";
		for(int i=0;i<sessions.length();i++) {
			String code=basicCode;
			SessionDB session=loadSessionParameters(sessions.getString(i));
			List<String> variables=operation.getVariables();
			Map<String,String[]> parameterList=session.getParameters();
			for(int j=0;j<variables.size();j++) {
				code+=variables.get(j)+"=["+String.join(",",parameterList.get(variables.get(j)))+"]\n";
			}
			code+=operation.getMethod_call();
			results.put(sessions.get(i).toString(), PythonService.execute(code));
		}
		return results;
	}
	
}