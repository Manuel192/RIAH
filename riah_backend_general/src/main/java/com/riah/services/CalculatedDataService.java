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
import com.riah.dao.CalculatedDataParameterDAO;
import com.riah.dao.GameDAO;
import com.riah.dao.SessionDAO;
import com.riah.model.CalculatedData;
import com.riah.model.CalculatedDataDTO;
import com.riah.model.CalculatedDataParameterDTO;
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
	private CalculatedDataParameterDAO cdpDAO;
	
	@Autowired
	private ParameterService parameterService;
	
	@Autowired
	private SessionService sessionService;
		
	public List<CalculatedDataDTO> loadCalculatedData(String id) throws ParseException {
		Game game=new Game(UUID.fromString(id));
		List<CalculatedData> calculatedData= calculatedDataDAO.findByGame(game);
		if(calculatedData==null) return null;
		List<List<String[]>> parameters = new ArrayList<>();
		for(int i=0;i<calculatedData.size();i++)
			parameters.add(cdpDAO.findParameterNamesByCalculatedData(calculatedData.get(i)));
		List<CalculatedDataDTO> parsedCalculatedData= mapCalculatedData(calculatedData,parameters);
		return parsedCalculatedData;
	}

	private List<CalculatedDataDTO> mapCalculatedData(List<CalculatedData> calculatedData, List<List<String[]>> parameters) {
		List<CalculatedDataDTO> result= new ArrayList<>();
		for(int i=0;i<calculatedData.size();i++) {
			CalculatedDataDTO calculatedDataDTO = new CalculatedDataDTO();
			calculatedDataDTO.setId(calculatedData.get(i).getId());
			calculatedDataDTO.setName(calculatedData.get(i).getName());
			calculatedDataDTO.setGameId(calculatedData.get(i).getGame().getId());
			calculatedDataDTO.setOperation(calculatedData.get(i).getOperation());
			calculatedDataDTO.setParameters(parameters.get(i).stream().map(parameter -> {
	            CalculatedDataParameterDTO cdpDTO = new CalculatedDataParameterDTO(parameter[0].trim(),parameter[1].trim(),Integer.parseInt(parameter[2]));
	            return cdpDTO;
	        }).collect(Collectors.toList()));
			calculatedDataDTO.setSessions(sessionService.getSessionsByGame(calculatedData.get(i).getGame().getId()));
			calculatedDataDTO.setSessionDates(sessionService.getSessionDatesByGame(calculatedData.get(i).getGame().getId()));
            result.add(calculatedDataDTO);
		}  
            return result;
	}
}