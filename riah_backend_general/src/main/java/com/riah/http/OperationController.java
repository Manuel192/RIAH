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

import com.riah.model.OperationDTO;
import com.riah.services.OperationService;

@RestController
@RequestMapping("/operation")
public class OperationController {
	
	@Autowired
	private OperationService operationService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadOperations")
    public ResponseEntity<List<OperationDTO>> loadOperations() throws ParseException{
		List<OperationDTO> calculatedData=operationService.loadOperations();
		return ResponseEntity.ofNullable(calculatedData);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertOperation")
	public ResponseEntity<OperationDTO> insertOperation(@RequestBody String operation){
		OperationDTO result=operationService.insertOperation(operation);
		return ResponseEntity.ok(result); 
	}
}
