package com.riah.sessions.http;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.riah.sessions.model.Operation;
import com.riah.sessions.model.OperationDTO;
import com.riah.sessions.model.Session;
import com.riah.sessions.model.SessionDTO;
import com.riah.sessions.model.SimpleOperation;
import com.riah.sessions.model.SimpleOperationDTO;
import com.riah.sessions.services.OperationService;
import com.riah.sessions.services.SessionService;
import com.riah.sessions.services.TokenAuthService;

@RestController
@RequestMapping("/operation")
public class OperationController {
	
	@Autowired
	OperationService operationService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadSimpleOperations")
	public ResponseEntity<List<SimpleOperationDTO>> loadSimpleOperations (@RequestHeader ("Authorization") String token) throws ParseException{
		if(!TokenAuthService.isValidToken(token.substring(7), true, true, true)) return ResponseEntity.ofNullable(null);
		return ResponseEntity.ok(operationService.loadSimpleOperations());
	} 
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadOperationsParameters")
	public ResponseEntity<List<OperationDTO>> loadOperationsParameters (@RequestHeader ("Authorization") String token) throws ParseException{
		if(!TokenAuthService.isValidToken(token.substring(7), true, true, true)) return ResponseEntity.ofNullable(null);
		return ResponseEntity.ok(operationService.loadOperationsParameters());
	} 
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertOperation")
	public ResponseEntity<String> insertOperation (@RequestHeader ("Authorization") String token,@RequestBody String operation){
		if(!TokenAuthService.isValidToken(token.substring(7), false, false, true)) return ResponseEntity.ofNullable(null);
		String id=operationService.insertOperation(operation);
		return ResponseEntity.ok(id);
	}
	/*
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertSimpleOperation")
	public ResponseEntity<String> insertSimpleOperation (@RequestHeader ("Authorization") String token,@RequestBody String operation){
		operationService.insertOperation(operation);
		return ResponseEntity.ok("Operation created successfully!");
	}
	*/
} 
