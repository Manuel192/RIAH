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

import com.riah.dao.CalculatedDataDAO;
import com.riah.dao.GameDAO;
import com.riah.dao.SessionDAO;
import com.riah.model.CalculatedData;
import com.riah.model.CalculatedDataDTO;
import com.riah.model.Game;
import com.riah.model.GameDTO;
import com.riah.model.Session;
import com.riah.model.SessionDTO;

import jakarta.annotation.PostConstruct;

@Service
public class CalculatedDataService {
	
	@Autowired
	private CalculatedDataDAO calculatedDataDAO;
	
	@Autowired
	private SessionService sessionService;
		
	public List<CalculatedDataDTO> loadCalculatedData(String id) throws ParseException {
		Game game=new Game(UUID.fromString(id));
		List<CalculatedData> calculatedData= calculatedDataDAO.findByGame(game);
		if(calculatedData==null) return null;
		List<CalculatedDataDTO> parsedCalculatedData= mapCalculatedData(calculatedData);
		return parsedCalculatedData;
	}

	private List<CalculatedDataDTO> mapCalculatedData(List<CalculatedData> calculatedData) {
		return calculatedData.stream().map(calculatedDat -> {
			CalculatedDataDTO calculatedDataDTO = new CalculatedDataDTO();
			calculatedDataDTO.setId(calculatedDat.getId());
			calculatedDataDTO.setName(calculatedDat.getName());
			calculatedDataDTO.setGameId(calculatedDat.getGame().getId());
			calculatedDataDTO.setOperation(calculatedDat.getOperation());
			calculatedDataDTO.setParameter1(calculatedDat.getParameter1());
			calculatedDataDTO.setParameter2(calculatedDat.getParameter2());
			calculatedDataDTO.setSessions(sessionService.getSessionsByGame(calculatedDat.getGame().getId()));
			calculatedDataDTO.setSessionDates(sessionService.getSessionDatesByGame(calculatedDat.getGame().getId()));
            return calculatedDataDTO;
        }).collect(Collectors.toList());
	}
}