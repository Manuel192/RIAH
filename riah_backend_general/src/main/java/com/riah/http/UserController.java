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

import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;

@RestController
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@RateLimiter(name = "registerLimiter", fallbackMethod = "tooManyRequestsRegister")
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertUser")
	public ResponseEntity<String> insertUser(@RequestParam String code, @RequestParam String role, @RequestBody String user){
		if(userService.insertUser(user,code,role)==true) {
			return ResponseEntity.ok("");
		}else {
			return ResponseEntity
		            .status(HttpStatus.FORBIDDEN)
		            .body("Código inválido");
		}
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/doubleFactor")
	public ResponseEntity<String> doubleFactor(@RequestBody String user) {
		try {
			String userId=userService.doubleFactor(user);
			return ResponseEntity.ok(userId);
		}catch(Exception e){
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se pudo realizar el registro. Pruebe otras credenciales o inténtelo más tarde.");
		}
	}
	
	@RateLimiter(name = "loginLimiter", fallbackMethod = "tooManyRequestsLogin")
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/loginPatient")
	public ResponseEntity<String> loginPatient(@RequestBody String user) throws Exception{
		String id=userService.loginPatient(user);
		if(!id.isBlank()) {
			return ResponseEntity.ok(id);
		} else {
			return ResponseEntity
		    .status(HttpStatus.FORBIDDEN)
		    .body("Email o contraseña incorrectos.");
		}
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/loginTherapist")
	public ResponseEntity<String> loginTherapist(@RequestBody String user) throws Exception{
		String id=userService.loginTherapist(user);
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
	
	public ResponseEntity<?> tooManyRequestsLogin(String user, RequestNotPermitted ex) {
	    return ResponseEntity.status(429).body("Demasiados intentos. Espera un momento.");
	}
	
	public ResponseEntity<?> tooManyRequestsRegister(String code, String user, RequestNotPermitted ex) {
	    return ResponseEntity.status(429).body("Demasiados intentos. Espera un momento.");
	}
}
