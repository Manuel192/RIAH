package com.riah.services;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.dao.ParameterDAO;
import com.riah.model.Game;
import com.riah.model.Parameter;
import com.riah.model.ParameterDTO;
import com.riah.model.Version;

@Service
public class ParameterService {
	
	@Autowired
	private ParameterDAO parameterDAO;
		
	public List<ParameterDTO> loadParameters() throws ParseException {
		List<Parameter> parameters= parameterDAO.findAll();
		if(parameters.size()==0) return null;
		List<ParameterDTO> parsedParameters= mapParameters(parameters);
		return parsedParameters;
	}
	
	public List<String> loadParametersNames(String id) throws ParseException {
		Version version=new Version(UUID.fromString(id));
		List<Parameter> parameters= parameterDAO.findByVersion(version);
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
			parameterDTO.setVersionId(parameter.getVersion().getId());
            return parameterDTO;
        }).collect(Collectors.toList());
	}

	public List<ParameterDTO> insertParameters(String parameter) {
		JSONObject json = new JSONObject(parameter);
		UUID versionId=UUID.fromString(json.getString("version"));
		JSONArray names=json.getJSONArray("names");
		List<Parameter> parametersToSave=new ArrayList<>();
		for(int i=0;i<names.length();i++) {
			parametersToSave.add(new Parameter(names.get(i).toString(),new Version(versionId)));
		}
		List<Parameter> savedParameters=parameterDAO.saveAll(parametersToSave);
		List<ParameterDTO> parsedParameters=mapParameters(savedParameters);
		return parsedParameters;
	}
}