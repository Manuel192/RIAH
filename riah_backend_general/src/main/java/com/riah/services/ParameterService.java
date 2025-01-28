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
import com.riah.dao.ParameterDAO;
import com.riah.dao.SessionDAO;
import com.riah.model.CalculatedData;
import com.riah.model.CalculatedDataDTO;
import com.riah.model.Game;
import com.riah.model.GameDTO;
import com.riah.model.Parameter;
import com.riah.model.ParameterDTO;
import com.riah.model.Session;
import com.riah.model.SessionDTO;

import jakarta.annotation.PostConstruct;

@Service
public class ParameterService {
	
	@Autowired
	private ParameterDAO parameterDAO;
	
	@Autowired
	private SessionService sessionService;
		
	public List<ParameterDTO> loadParameters(String id) throws ParseException {
		Game game=new Game(UUID.fromString(id));
		List<Parameter> parameters= parameterDAO.findByGame(game);
		if(parameters==null) return null;
		List<ParameterDTO> parsedParameter= mapParameters(parameters);
		return parsedParameter;
	}

	private List<ParameterDTO> mapParameters(List<Parameter> parameters) {
		return parameters.stream().map(parameter -> {
			ParameterDTO parameterDTO = new ParameterDTO();
			parameterDTO.setId(parameter.getId());
			parameterDTO.setName(parameter.getName());
			parameterDTO.setGameId(parameter.getGame().getId());
            return parameterDTO;
        }).collect(Collectors.toList());
	}

	public ParameterDTO insertParameter(String parameter) {
		JSONObject json = new JSONObject(parameter);
		UUID gameId=UUID.fromString(json.getString("game"));
		String name=json.getString("name");
		Parameter parameterToInsert=new Parameter(name,new Game(gameId));
		Parameter savedParameter=parameterDAO.save(parameterToInsert);
		List<Parameter> parameterToParse=new ArrayList<>();
		parameterToParse.add(savedParameter);
		List<ParameterDTO> parsedParameter=mapParameters(parameterToParse);
		return parsedParameter.getFirst();
	}
}