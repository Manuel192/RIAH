package com.riah.http;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.dao.SessionDAO;
import com.riah.model.OperationDTO;
import com.riah.model.GameDTO;
import com.riah.model.ParameterDTO;
import com.riah.model.Session;
import com.riah.services.OperationService;
import com.riah.services.GameService;
import com.riah.services.ParameterService;
import com.riah.services.SessionService;
import com.riah.model.SessionDTO;

@RestController
@RequestMapping("/parameter")
public class ParameterController {
	
	@Autowired
	private ParameterService parameterService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadParameters")
    public ResponseEntity<List<ParameterDTO>> loadParameters(@RequestParam String gameId) throws ParseException{
		List<ParameterDTO> parameters=parameterService.loadParameters(gameId);
    	if(!parameters.isEmpty())
			return ResponseEntity.ok(parameters);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertParameter")
	public ResponseEntity<ParameterDTO> insertSession(@RequestBody String parameter){
		ParameterDTO result=parameterService.insertParameter(parameter);
		return ResponseEntity.ok(result); 
	}
}
