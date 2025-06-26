package com.riah.http;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.services.UserService;

@RestController
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertUser")
	public ResponseEntity<String> insertUser(@RequestParam String code, @RequestBody String user){
		if(userService.insertUser(user,code)==true) {
			return ResponseEntity.ok("");
		}else {
			return ResponseEntity
		            .status(HttpStatus.FORBIDDEN)
		            .body("Código inválido");
		}
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/doubleFactor")
	public ResponseEntity<String> doubleFactor(@RequestBody String user) throws JSONException, Exception{
		String userId=userService.doubleFactor(user);
		return ResponseEntity.ok(userId);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/loginUser")
	public ResponseEntity<String> loginUser(@RequestBody String user) throws Exception{
		String id=userService.loginUser(user);
		if(!id.isBlank()) {
			return ResponseEntity.ok(id);
		} else {
			return ResponseEntity
		    .status(HttpStatus.FORBIDDEN)
		    .body("Email o contraseña incorrectos.");
		}
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/loginAdmin")
	public ResponseEntity<String> loginAdmin(@RequestBody String user) throws Exception{
		String id=userService.loginAdmin(user);
		if(!id.isBlank()) {
			return ResponseEntity.ok(id);
		} else {
			return ResponseEntity
		    .status(HttpStatus.FORBIDDEN)
		    .body("Email o contraseña incorrectos.");
		}
	}
}
