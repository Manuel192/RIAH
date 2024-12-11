package com.riah.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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
            sessionDTO.setHospital(session.getHospital().getName());
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
}