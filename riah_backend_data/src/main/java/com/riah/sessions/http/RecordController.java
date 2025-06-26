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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.sessions.model.RecordDTO;
import com.riah.sessions.model.SessionDTO;
import com.riah.sessions.services.RecordService;
import com.riah.sessions.services.SessionService;

@RestController
@RequestMapping("/record")
public class RecordController {
	
	@Autowired
	RecordService recordService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadRecord")
    public ResponseEntity<RecordDTO> loadRecord(@RequestParam String id) throws ParseException{
		RecordDTO record=recordService.loadRecord(id);
		if(record!=null)
			return ResponseEntity.ok(record);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertRecord")
	public ResponseEntity<String> insertRecord () throws ParseException{
		String recordID=recordService.insertRecord();
		return ResponseEntity.ok(recordID);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PutMapping("/updateRecord")
	public ResponseEntity<String> updateRecord (@RequestBody String record) throws ParseException{
		recordService.updateRecord(record);
		return ResponseEntity.ok("Session created successfully!");
	}
} 
