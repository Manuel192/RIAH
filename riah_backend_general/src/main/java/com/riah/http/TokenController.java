package com.riah.http;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.model.GameDTO;
import com.riah.model.Token;
import com.riah.services.GameService;
import com.riah.services.PatientService;
import com.riah.services.TokenService;

@RestController
@RequestMapping("/token")
public class TokenController {
	
	@Autowired
	private TokenService tokenService;
	
	@Autowired
	private GameService gameService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/checkPatientToken")
    public ResponseEntity<String> checkPatientToken(@RequestParam String token) throws ParseException{
		String oToken=tokenService.checkPatientToken(token);
		if(oToken.length()>0) {
			return ResponseEntity.ok(oToken);
		}else {
		return ResponseEntity
	            .status(HttpStatus.FORBIDDEN)
	            .body("Token inválido");
		}
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/checkTherapistToken")
    public ResponseEntity<String> checkTherapistToken(@RequestParam String token) throws ParseException{
		String oToken=tokenService.checkTherapistToken(token);
		if(oToken.length()>0) {
			return ResponseEntity.ok(oToken);
		}else {
		return ResponseEntity
	            .status(HttpStatus.FORBIDDEN)
	            .body("Token inválido");
		}
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/checkAdminToken")
    public ResponseEntity<String> checkAdminToken(@RequestParam String token) throws ParseException{
		String oToken=tokenService.checkAdminToken(token);
		if(oToken.length()>0) {
			return ResponseEntity.ok(oToken);
		}else {
		return ResponseEntity
	            .status(HttpStatus.FORBIDDEN)
	            .body("Token inválido");
		}
    }
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/createPatientToken")
    public ResponseEntity<String> createPatientToken(@RequestParam String id) throws ParseException{
		String oToken=tokenService.createPatientToken(id);
		return ResponseEntity.ok(oToken);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/createTherapistToken")
    public ResponseEntity<String> createTherapistToken(@RequestParam String id) throws ParseException{
		String oToken=tokenService.createTherapistToken(id);
		return ResponseEntity.ok(oToken);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/createAdminToken")
    public ResponseEntity<String> createAdminToken(@RequestParam String id) throws ParseException{
		String oToken=tokenService.createAdminToken(id);
		return ResponseEntity.ok(oToken);
	}
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/createToken")
    public ResponseEntity<String> createToken(@RequestParam String id, @RequestParam String role) throws ParseException{
		String oToken=tokenService.createToken(id,role);
		return ResponseEntity.ofNullable(oToken);
	}
}
