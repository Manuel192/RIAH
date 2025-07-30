package com.riah.services;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.dao.OperationDAO;
import com.riah.model.Game;
import com.riah.model.Operation;
import com.riah.model.OperationDTO;
import com.riah.model.Session;

@Service
public class OperationService {
	
	@Autowired
	private OperationDAO operationDAO;
	
	@Autowired
	private SessionService sessionService;
		
	@Autowired
	private ImplementationService implementationService;
	
	public List<OperationDTO> loadOperations() throws ParseException {
		List<Operation> operations= operationDAO.findAll();
		if(operations.size()==0) return null;
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
			List<Session> gameSessions=sessionService.getRawSessionsByGame(operations.get(i).getGame().getId());
			OperationDTO operationDTO = new OperationDTO();
			operationDTO.setId(operations.get(i).getId());
			operationDTO.setName(operations.get(i).getName());
			operationDTO.setGameId(operations.get(i).getGame().getId());
			operationDTO.setOperation(operations.get(i).getOperation());
			operationDTO.setVersions(implementationService.getOperationImplementedVersions(operations.get(i).getId()));
			operationDTO.setSessions(sessionService.getSessionsByGame(gameSessions));
			operationDTO.setSessionDates(sessionService.getSessionDatesByGame(gameSessions));
			operationDTO.setSessionVersions(sessionService.getSessionVersionsByGame(gameSessions));
            result.add(operationDTO);
		}  
            return result;
	}
}