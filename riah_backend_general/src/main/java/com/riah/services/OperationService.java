package com.riah.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.riah.dao.OperationDAO;
import com.riah.dao.GameDAO;
import com.riah.dao.SessionDAO;
import com.riah.model.Operation;
import com.riah.model.OperationDTO;
import com.riah.model.Game;
import com.riah.model.GameDTO;
import com.riah.model.Parameter;
import com.riah.model.ParameterDTO;
import com.riah.model.Session;
import com.riah.model.SessionDTO;

import jakarta.annotation.PostConstruct;

@Service
public class OperationService {
	
	@Autowired
	private OperationDAO operationDAO;
	
	@Autowired
	private SessionService sessionService;
		
	public List<OperationDTO> loadOperations(String id) throws ParseException {
		Game game=new Game(UUID.fromString(id));
		List<Operation> operations= operationDAO.findByGame(game);
		if(operations==null) return null;
		List<OperationDTO> parsedOperations= mapOperations(operations);
		return parsedOperations;
	}
	
	public OperationDTO insertOperation(String operation) {
		JSONObject json = new JSONObject(operation);
		UUID gameId=UUID.fromString(json.getString("game"));
		String name=json.getString("name");
		String operationID=json.getString("operationId");
		Operation operationToInsert=new Operation(name,new Game(gameId),operationID);
		Operation savedOperation=operationDAO.save(operationToInsert);
		List<Operation> operationToParse=new ArrayList<>();
		operationToParse.add(savedOperation);
		List<OperationDTO> parsedOperation=mapOperations(operationToParse);
		return parsedOperation.getFirst();
	}
	
	private List<OperationDTO> mapOperations(List<Operation> operations) {
		List<OperationDTO> result= new ArrayList<>();
		for(int i=0;i<operations.size();i++) {
			OperationDTO operationDTO = new OperationDTO();
			operationDTO.setId(operations.get(i).getId());
			operationDTO.setName(operations.get(i).getName());
			operationDTO.setGameId(operations.get(i).getGame().getId());
			operationDTO.setOperation(operations.get(i).getOperation());
			operationDTO.setSessions(sessionService.getSessionsByGame(operations.get(i).getGame().getId()));
			operationDTO.setSessionDates(sessionService.getSessionDatesByGame(operations.get(i).getGame().getId()));
            result.add(operationDTO);
		}  
            return result;
	}
}