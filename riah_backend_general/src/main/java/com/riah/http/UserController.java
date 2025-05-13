package com.riah.http;

import java.io.IOException;
import java.security.GeneralSecurityException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riah.services.UserService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.AddressException;

@RestController
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertPatient")
	public ResponseEntity<String> insertSession(@RequestBody String user){
		String id=userService.insertUser(user);
		return ResponseEntity.ok(id);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/doubleFactor")
	public ResponseEntity<String> doubleFactor(@RequestBody String user) throws AddressException, IOException, MessagingException, GeneralSecurityException{
		String code=userService.doubleFactor(user);
		return ResponseEntity.ok(code);
	}
}
