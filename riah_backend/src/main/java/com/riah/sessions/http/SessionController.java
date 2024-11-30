package com.riah.sessions.http;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riah.sessions.model.Session;
import com.riah.sessions.services.SessionService;

@RestController
@RequestMapping("/session")
public class SessionController {
	
	@Autowired
	SessionService sessionService;
	
	@GetMapping("/example")
    public ResponseEntity<List<String>> example(){
    	return ResponseEntity.ok(sessionService.example());
    }
}
