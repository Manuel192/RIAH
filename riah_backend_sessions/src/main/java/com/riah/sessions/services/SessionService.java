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
import com.riah.sessions.model.SessionDTO;

@Service
public class SessionService {
	
	@Autowired
	private SessionDAO sessionDAO;

	public SessionDTO loadSessionRawData(UUID id) throws ParseException {
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
		Session session= sessionDAO.loadSessionRawData(id);
		if(session==null) return null;
		
		SessionDTO parsedSession=new SessionDTO(session.getId());
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

	public boolean insertSession(String session) {
		JSONObject json = new JSONObject(session);
		ArrayList<String> parsedFrames=new ArrayList<>();
		JSONArray frames=json.getJSONArray("frames");
		SessionInsert sessionToInsert=new SessionInsert(json.getString("id"),frames.toList());
		sessionDAO.insertSession(sessionToInsert);
		return true;
	}

	public Map<UUID, Double> calculateMeans(String parameter1, List<String> sessions) throws ParseException {
		Map<UUID, Double> means=new HashMap<>();
		for(int i=0;i<sessions.size();i++) {
			List<Double> values= new ArrayList<>();
			SessionDTO session=loadSessionRawData(UUID.fromString(sessions.get(i)));
			List<Frame> sessionFrames=session.getFrames();
			for(int j=0;j<sessionFrames.size();j++) {
				values.add(Math.abs(Double.parseDouble(sessionFrames.get(j).getDataValues().get(parameter1))));
			}
			Double mean=values.stream()
	                .mapToDouble(a -> a)
	                .average().getAsDouble();
			means.put(UUID.fromString(sessions.get(i)), mean);
		}
		return means;
	}

	public Map<UUID, Double> calculateDifferences(String parameter1, String parameter2, List<String> sessions) throws ParseException {
		Map<UUID, Double> differences=new HashMap<>();
		for(int i=0;i<sessions.size();i++) {
			List<Double> values= new ArrayList<>();
			SessionDTO session=loadSessionRawData(UUID.fromString(sessions.get(i)));
			List<Frame> sessionFrames=session.getFrames();
			for(int j=0;j<sessionFrames.size();j++) {
				Double param1=Double.parseDouble(sessionFrames.get(j).getDataValues().get(parameter1));
				Double param2=Double.parseDouble(sessionFrames.get(j).getDataValues().get(parameter2));
				values.add(Math.abs(param1-param2));
			}
			Double difference=values.stream()
	                .mapToDouble(a -> a)
	                .average().getAsDouble();
			differences.put(UUID.fromString(sessions.get(i)), difference);
		}
		return differences;
	}
	
}