package com.riah.sessions.http;

import java.text.ParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

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

import com.riah.sessions.model.RecordDTO;
import com.riah.sessions.model.SessionDTO;
import com.riah.sessions.services.RecordService;
import com.riah.sessions.services.SessionService;
import com.riah.sessions.services.TokenAuthService;

@RestController
@RequestMapping("/record")
public class RecordController {
	
	@Autowired
	RecordService recordService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadRecord")
    public ResponseEntity<RecordDTO> loadRecord(@RequestHeader ("Authorization") String token,@RequestParam String id) throws ParseException{
		if(!TokenAuthService.isValidToken(token.substring(7), true, true, false)) return ResponseEntity.ofNullable(null);
		RecordDTO record=recordService.loadRecord(id);
		if(record!=null)
			return ResponseEntity.ok(record);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertRecord")
	public ResponseEntity<String> insertRecord (@RequestHeader ("Authorization") String token) throws ParseException{
		if(!TokenAuthService.isValidToken(token.substring(7), true, true, false)) return ResponseEntity.ofNullable(null);
		String recordID=recordService.insertRecord();
		return ResponseEntity.ok(recordID);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PutMapping("/updateRecord")
	public ResponseEntity<String> updateRecord (@RequestHeader ("Authorization") String token,@RequestBody String record) throws ParseException{
		if(!TokenAuthService.isValidToken(token.substring(7), true, true, false)) return ResponseEntity.ofNullable(null);
		recordService.updateRecord(record);
		return ResponseEntity.ok("Session created successfully!");
	}
} 
