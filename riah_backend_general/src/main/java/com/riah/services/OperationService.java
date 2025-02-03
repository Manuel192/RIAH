package com.riah.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.riah.dao.CalculatedDataDAO;
import com.riah.dao.GameDAO;
import com.riah.dao.OperationDAO;
import com.riah.dao.ParameterDAO;
import com.riah.dao.SessionDAO;
import com.riah.model.CalculatedData;
import com.riah.model.CalculatedDataDTO;
import com.riah.model.Game;
import com.riah.model.GameDTO;
import com.riah.model.Operation;
import com.riah.model.OperationDTO;
import com.riah.model.Parameter;
import com.riah.model.ParameterDTO;
import com.riah.model.Session;
import com.riah.model.SessionDTO;

import jakarta.annotation.PostConstruct;

@Service
public class OperationService {
	
	@Autowired
	private OperationDAO operationDAO;
		
	public List<OperationDTO> loadOperations() throws ParseException {
		List<Operation> operations= operationDAO.findAll();
		if(operations.isEmpty()) return null;
		List<OperationDTO> parsedOperations= mapOperations(operations);
		return parsedOperations;
	}
	
	private List<OperationDTO> mapOperations(List<Operation> operations) {
		return operations.stream().map(operation -> {
			OperationDTO operationDTO = new OperationDTO();
			operationDTO.setId(operation.getId());
			operationDTO.setName(operation.getName());
			operationDTO.setNoParameters(operation.getNoParameters());
            return operationDTO;
        }).collect(Collectors.toList());
	}
	
	public OperationDTO insertOperation(String operation) {
		JSONObject json = new JSONObject(operation);
		String name=json.getString("name");
		int noParameters=json.getInt("noParameters");
		Operation operationToInsert=new Operation(name,noParameters);
		Operation savedOperation=operationDAO.save(operationToInsert);
		List<Operation> operationToParse=new ArrayList<>();
		operationToParse.add(savedOperation);
		List<OperationDTO> parsedParameter=mapOperations(operationToParse);
		return parsedParameter.getFirst();
	}
}