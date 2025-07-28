package com.riah.services;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.dao.SessionDAO;
import com.riah.model.Game;
import com.riah.model.Patient;
import com.riah.model.Session;
import com.riah.model.SessionDTO;
import com.riah.model.User;

@Service
public class SessionService {
	
	@Autowired
	private SessionDAO sessionDAO;
		
	public List<SessionDTO> loadDateFilteredSessions(Date firstDate, Date lastDate, String patientId) throws ParseException {
		List<Session> sessions= sessionDAO.loadDateFilteredSessionsPatient(firstDate, lastDate, new Patient(UUID.fromString(patientId)));
		if(sessions==null) return null;
		
		List<SessionDTO> parsedSessions= mapSessions(sessions);
		return parsedSessions;
	}

	private List<SessionDTO> mapSessions(List<Session> sessions) {
		return sessions.stream().map(session -> {
            SessionDTO sessionDTO = new SessionDTO();
            sessionDTO.setId(session.getId());
            sessionDTO.setDate(session.getDate());
            try {
				sessionDTO.setPatient(session.getPatient().getName());
			} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException
					| BadPaddingException e) {}
            sessionDTO.setVersion(session.getVersion().getName());
            sessionDTO.setVideoID(session.getVideoID());
            sessionDTO.setDataID(session.getDataID());
            return sessionDTO;
        }).collect(Collectors.toList());
	}

	public List<SessionDTO> loadAll(String patientId) {
		List<Session> sessions= sessionDAO.findByPatient(new Patient(UUID.fromString(patientId)));
		if(sessions.isEmpty()) 
			return null;
		
		List<SessionDTO> parsedSessions= mapSessions(sessions);
		return parsedSessions;
	}

	public List<SessionDTO> loadGameFilteredSessions(String gameId, String patientId) {
		Game game=new Game(UUID.fromString(gameId));
		List<Session> sessions= sessionDAO.findByGamePatient(game, new Patient(UUID.fromString(patientId)));
		if(sessions.isEmpty()) 
			return null;
		
		List<SessionDTO> parsedSessions= mapSessions(sessions);
		return parsedSessions;
	}

	public String insertSession(String session) {
		JSONObject json = new JSONObject(session);
		UUID versionId=UUID.fromString(json.getString("version"));
		UUID patientId=UUID.fromString(json.getString("patient"));
		String videoId="";
		try {
			videoId=json.getString("video_id");
		}catch(JSONException jsone) {
		}
		String dataId=json.getString("data_id");
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String dateString=json.getString("date");
		Date date=null;
		try {
			date = sdf.parse(dateString);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		Session sessionToInsert=new Session(versionId,patientId,date,videoId,dataId);
		Session savedSession=sessionDAO.save(sessionToInsert);
		return savedSession.getId().toString();
	}

	public Map<String,Date> getSessionDatesByGame(UUID gameId) {
		Game game=new Game(gameId);
		List<Session> sessions= sessionDAO.findByGame(game);
		Map<String,Date> result=new HashMap<>();
		for(int i=0;i<sessions.size();i++) {
			Session session=sessions.get(i);
			result.put(session.getDataID().toString(), session.getDate());
		}
		return result;
	}
	
	public List<String> getSessionsByGame(UUID gameId) {
		Game game=new Game(gameId);
		List<Session> sessions= sessionDAO.findByGame(game);
		sessions.sort(new Comparator<Session>() {
			@Override
			public int compare(Session o1, Session o2) {
				return o1.getDate().compareTo(o2.getDate());
			}
		});
		List<String> result=new ArrayList<>();
		for(int i=0;i<sessions.size();i++) {
			result.add(sessions.get(i).getDataID());
		}
		return result;
	}
}