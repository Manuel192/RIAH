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
import com.riah.sessions.model.Session;
import com.riah.sessions.model.SessionInsert;
import com.riah.sessions.so.PythonExecutor;
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
	
	public void checkJSON(String session) {
		JSONObject json = new JSONObject(session);
		JSONArray frames=json.getJSONArray("frames");
		return;
	}

	public String insertSession(String session) {
		JSONObject json = new JSONObject(session);
		ArrayList<String> parsedFrames=new ArrayList<>();
		JSONArray frames=json.getJSONArray("frames");
		SessionInsert sessionToInsert=new SessionInsert(frames.toList());
		SessionInsert savedSession=sessionDAO.insertSession(sessionToInsert);
		return savedSession.get_id().toString();
	}

	public Map<UUID, String> calculateData(String sessionsParameters, String operation) throws ParseException {
		Map<UUID, String> results=new HashMap<>();
		JSONObject json = new JSONObject(sessionsParameters);
		JSONArray sessions=json.getJSONArray("sessions");
		List<String> parameters=new ArrayList<>();
		int parametersSize=json.getJSONArray("parameters").length();
		for(int k=0;k<parametersSize;k++) {
			parameters.add(json.getJSONArray("parameters").getJSONObject(k).getString("name"));
		}
		String code=operationService.loadOperation(operation);
		for(int i=0;i<sessions.length();i++) {
			String[] values= new String[parametersSize];
			for(int j=0;j<parametersSize;j++) values[j]="";
			List<Frame> sessionFrames=loadSessionRawData(sessions.get(i).toString()).getFrames();
			for(int j=0;j<sessionFrames.size();j++) {
				Map<String,String> dataValues=sessionFrames.get(j).getDataValues();
				for(int k=0;k<parametersSize;k++) {
					String value=dataValues.get(parameters.get(k));
					values[k]+=value.trim()+",";
				}
			}
			for(int j=0;j<parametersSize;j++) values[j]=values[j].substring(0,values[j].length()-2);
			results.put(UUID.fromString(sessions.get(i).toString()), PythonExecutor.execute(code, values));
		}
		return results;
	}
	
}