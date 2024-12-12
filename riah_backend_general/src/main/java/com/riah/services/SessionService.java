package com.riah.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.riah.dao.SessionDAO;
import com.riah.model.Game;
import com.riah.model.Session;
import com.riah.model.SessionDTO;

import jakarta.annotation.PostConstruct;

@Service
public class SessionService {
	
	@Autowired
	private SessionDAO sessionDAO;
		
	public List<SessionDTO> loadDateFilteredSessions(Date firstDate, Date lastDate) throws ParseException {
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
		List<Session> sessions= sessionDAO.loadDateFilteredSessions(firstDate, lastDate);
		if(sessions==null) return null;
		
		List<SessionDTO> parsedSessions= mapSessions(sessions);
		return parsedSessions;
	}

	private List<SessionDTO> mapSessions(List<Session> sessions) {
		return sessions.stream().map(session -> {
            SessionDTO sessionDTO = new SessionDTO();
            sessionDTO.setId(session.getId());
            sessionDTO.setDate(session.getDate());
            sessionDTO.setPatient(session.getPatient().getName());
            sessionDTO.setGame(session.getGame().getName());
            return sessionDTO;
        }).collect(Collectors.toList());
	}

	public List<SessionDTO> loadAll() {
		List<Session> sessions= sessionDAO.findAll();
		if(sessions.isEmpty()) 
			return null;
		
		List<SessionDTO> parsedSessions= mapSessions(sessions);
		return parsedSessions;
	}

	public List<SessionDTO> loadGameFilteredSessions(String gameId) {
		Game game=new Game(UUID.fromString(gameId));
		List<Session> sessions= sessionDAO.findByGame(game);
		if(sessions.isEmpty()) 
			return null;
		
		List<SessionDTO> parsedSessions= mapSessions(sessions);
		return parsedSessions;
	}

	public String insertSession(String session) {
		JSONObject json = new JSONObject(session);
		UUID gameId=UUID.fromString(json.getString("game"));
		UUID patientId=UUID.fromString(json.getString("patient"));
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
		System.out.print(session);
		String dateString=json.getString("date");
		Date date=null;
		try {
			date = sdf.parse(dateString);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Session sessionToInsert=new Session(gameId,patientId,date);
		Session savedSession=sessionDAO.save(sessionToInsert);
		return savedSession.getId().toString();
	}

	public Map<String,Date> getSessionDatesByGame(UUID gameId) {
		Game game=new Game(gameId);
		List<Session> sessions= sessionDAO.findByGame(game);
		Map<String,Date> result=new HashMap<>();
		for(int i=0;i<sessions.size();i++) {
			Session session=sessions.get(i);
			result.put(session.getId().toString(), session.getDate());
		}
		return result;
	}
	
	public List<String> getSessionsByGame(UUID gameId) {
		Game game=new Game(gameId);
		List<Session> sessions= sessionDAO.findByGame(game);
		List<String> result=new ArrayList<>();
		for(int i=0;i<sessions.size();i++) {
			result.add(sessions.get(i).getId().toString());
		}
		return result;
	}
}