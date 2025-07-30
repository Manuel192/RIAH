package com.riah.sessions.http;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.json.JSONArray;
import org.json.JSONException;
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
import com.riah.sessions.model.Session;
import com.riah.sessions.model.SessionDTO;
import com.riah.sessions.services.SessionService;
import com.riah.sessions.services.TokenAuthService;

@RestController
@RequestMapping("/rawDataSession")
public class SessionController {
	
	@Autowired
	SessionService sessionService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadSessionRawData")
    public ResponseEntity<SessionDTO> loadSessionRawData(@RequestHeader ("Authorization") String token, @RequestParam String id) throws ParseException, JsonMappingException, JsonProcessingException, InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException{
		if(!TokenAuthService.isValidToken(token.substring(7), true, true, false)) return ResponseEntity.ofNullable(null);
		SessionDTO session=sessionService.loadSessionRawData(id);
    	if(!(session==null))
			return ResponseEntity.ok(session);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertSession")
	public ResponseEntity<String> insertSession (@RequestHeader ("Authorization") String token,@RequestBody String session) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, JsonProcessingException{
		if(!TokenAuthService.isValidToken(token.substring(7), true, true, false)) return ResponseEntity.ofNullable(null);
		String id=sessionService.insertSession(session);
		return ResponseEntity.ok(id);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/checkJson")
	public ResponseEntity<String> checkJson (@RequestHeader ("Authorization") String token, @RequestBody String session){
		if(!TokenAuthService.isValidToken(token.substring(7), true, true, false)) return ResponseEntity.ofNullable(null);
		sessionService.checkJSON(session);
		return ResponseEntity.ok("Session checked successfully!");
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PutMapping("/calculateData")
	public ResponseEntity<Map<String, String>> calculateData (@RequestHeader ("Authorization") String token, @RequestParam String operation, @RequestBody String sessions) throws ParseException, JsonMappingException, JsonProcessingException, InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, JSONException{
		if(!TokenAuthService.isValidToken(token.substring(7), true, true, false)) return ResponseEntity.ofNullable(null);
		Map<String,String> sessionData=sessionService.calculateData(sessions, operation);
		if(sessionData.size()==0) {
			ResponseEntity.ofNullable(null);
		}
		return ResponseEntity.ok(sessionData);
	}
} 
