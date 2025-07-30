package com.riah.http;

import java.text.ParseException;
import java.util.List;

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

import com.riah.model.ParameterDTO;
import com.riah.services.ParameterService;
import com.riah.services.RecordService;
import com.riah.services.TokenService;

@RestController
@RequestMapping("/record")
public class RecordController {
	
	@Autowired
	private RecordService recordService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadRecord")
    public ResponseEntity<String> loadRecord(@RequestHeader("Authorization") String token,@RequestParam String patient) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),true,true,false)) return ResponseEntity.ofNullable(null);
		String recordID=recordService.loadRecord(patient);
		if(recordID.length()>0)
			return ResponseEntity.ok(recordID);
		else
			return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertRecord")
    public ResponseEntity<String> insertRecord(@RequestHeader("Authorization") String token,@RequestParam String patient, @RequestParam String dataID) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),true,true,false)) return ResponseEntity.ofNullable(null);
		String recordID=recordService.insertRecord(patient,dataID);
		return ResponseEntity.ok(recordID);
    }
}
