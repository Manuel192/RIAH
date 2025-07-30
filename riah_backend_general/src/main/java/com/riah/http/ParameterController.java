package com.riah.http;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.model.ParameterDTO;
import com.riah.services.ParameterService;
import com.riah.services.TokenService;

@RestController
@RequestMapping("/parameter")
public class ParameterController {
	
	@Autowired
	private ParameterService parameterService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadParameters")
    public ResponseEntity<List<ParameterDTO>> loadParameters(@RequestHeader("Authorization") String token) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),true,true,true)) return ResponseEntity.ofNullable(null);
		List<ParameterDTO> parameters=parameterService.loadParameters();
    	if(!parameters.isEmpty())
			return ResponseEntity.ok(parameters);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertParameters")
	public ResponseEntity<List<ParameterDTO>> insertParameter(@RequestHeader("Authorization") String token,@RequestBody String parameters) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),false,false,true)) return ResponseEntity.ofNullable(null);
		List<ParameterDTO> result=parameterService.insertParameters(parameters);
		return ResponseEntity.ok(result); 
	}
}
