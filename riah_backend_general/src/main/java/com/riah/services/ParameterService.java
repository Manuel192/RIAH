package com.riah.services;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.dao.ParameterDAO;
import com.riah.model.Game;
import com.riah.model.Parameter;
import com.riah.model.ParameterDTO;

@Service
public class ParameterService {
	
	@Autowired
	private ParameterDAO parameterDAO;
		
	public List<ParameterDTO> loadParameters(String id) throws ParseException {
		Game game=new Game(UUID.fromString(id));
		List<Parameter> parameters= parameterDAO.findByGame(game);
		if(parameters==null) return null;
		List<ParameterDTO> parsedParameter= mapParameters(parameters);
		return parsedParameter;
	}
	
	public List<String> loadParametersNames(String id) throws ParseException {
		Game game=new Game(UUID.fromString(id));
		List<Parameter> parameters=parameterDAO.findByGame(game);
		List<String> result=new ArrayList<>();
		for(int i=0;i<parameters.size();i++)
			result.add(parameters.get(i).getName());
		return result;
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