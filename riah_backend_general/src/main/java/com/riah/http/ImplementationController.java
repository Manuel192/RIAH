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

import com.riah.model.ImplementationParameterDTO;
import com.riah.model.OperationDTO;
import com.riah.services.ImplementationService;
import com.riah.services.OperationService;
import com.riah.services.TokenService;

@RestController
@RequestMapping("/implementation")
public class ImplementationController {
	
	@Autowired
	private ImplementationService implementationService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertImplementation")
	public ResponseEntity<String> insertImplementation(@RequestHeader("Authorization") String token,@RequestBody String implementation) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),false,false,true)) return ResponseEntity.ofNullable(null);
		String result=implementationService.insertImplementation(implementation);
		if(result.length()>0)
			return ResponseEntity.ok(result);
		else
			return ResponseEntity.ofNullable(null);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadImplementationParameters")
    public ResponseEntity<List<ImplementationParameterDTO>> loadImplementationParameters(@RequestHeader("Authorization") String token) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),true,true,true)) return ResponseEntity.ofNullable(null);
		List<ImplementationParameterDTO> calculatedData=implementationService.loadImplementationParameters();
		return ResponseEntity.ofNullable(calculatedData);
    }
}
