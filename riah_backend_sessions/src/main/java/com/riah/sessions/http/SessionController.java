package com.riah.sessions.http;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.sessions.model.Session;
import com.riah.sessions.model.SessionDTO;
import com.riah.sessions.services.SessionService;

@RestController
@RequestMapping("/rawDataSession")
public class SessionController {
	
	@Autowired
	SessionService sessionService;
	
	@GetMapping("/example")
    public ResponseEntity<List<String>> example(){
    	return ResponseEntity.ok(sessionService.example());
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadSessionRawData")
    public ResponseEntity<SessionDTO> loadSessionRawData(@RequestParam UUID id) throws ParseException{
		SessionDTO session=sessionService.loadSessionRawData(id);
    	if(!(session==null))
			return ResponseEntity.ok(session);
    	else
    		return ResponseEntity.ofNullable(null);
    }
}
