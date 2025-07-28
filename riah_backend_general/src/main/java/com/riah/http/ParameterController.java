package com.riah.http;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.model.ParameterDTO;
import com.riah.services.ParameterService;

@RestController
@RequestMapping("/parameter")
public class ParameterController {
	
	@Autowired
	private ParameterService parameterService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadParameters")
    public ResponseEntity<List<ParameterDTO>> loadParameters() throws ParseException{
		List<ParameterDTO> parameters=parameterService.loadParameters();
    	if(!parameters.isEmpty())
			return ResponseEntity.ok(parameters);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertParameters")
	public ResponseEntity<List<ParameterDTO>> insertParameter(@RequestBody String parameters){
		List<ParameterDTO> result=parameterService.insertParameters(parameters);
		return ResponseEntity.ok(result); 
	}
}
