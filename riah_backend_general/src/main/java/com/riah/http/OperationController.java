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
import com.riah.model.CalculatedDataDTO;
import com.riah.model.GameDTO;
import com.riah.model.OperationDTO;
import com.riah.model.ParameterDTO;
import com.riah.model.Session;
import com.riah.services.CalculatedDataService;
import com.riah.services.GameService;
import com.riah.services.OperationService;
import com.riah.services.ParameterService;
import com.riah.services.SessionService;
import com.riah.model.SessionDTO;

@RestController
@RequestMapping("/operation")
public class OperationController {
	
	@Autowired
	private OperationService operationService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadOperations")
    public ResponseEntity<List<OperationDTO>> loadOperations() throws ParseException{
		List<OperationDTO> operations=operationService.loadOperations();
    	if(!operations.isEmpty())
			return ResponseEntity.ok(operations);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertOperation")
	public ResponseEntity<OperationDTO> insertOperation(@RequestBody String operation){
		OperationDTO result=operationService.insertOperation(operation);
		return ResponseEntity.ok(result); 
	}
}
