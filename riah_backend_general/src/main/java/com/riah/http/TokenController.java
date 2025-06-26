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

@RestController
@RequestMapping("/token")
public class TokenController {
	
	private int MINUTES=30;
	
	private List<Token> userTokens = new ArrayList<>();
	private List<Token> adminTokens = new ArrayList<>();
	
	@Autowired
	private GameService gameService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/checkUserToken")
    public ResponseEntity<String> checkUserToken(@RequestParam String token) throws ParseException{
		Optional<Token> tokenO=userTokens.stream().filter(o -> o.getId().toString().contentEquals(token)).findFirst();
		if(tokenO.isPresent()) {
			Date currentTime=new Date(System.currentTimeMillis());
			if(tokenO.get().getLimit().after(currentTime)) {
				return ResponseEntity.ok(tokenO.get().getUserID());
			}else {
				userTokens.remove(tokenO.get());
			}
		}
		return ResponseEntity
	            .status(HttpStatus.FORBIDDEN)
	            .body("Token inválido");
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/checkAdminToken")
    public ResponseEntity<String> checkAdminToken(@RequestParam String token) throws ParseException{
		Optional<Token> tokenO=adminTokens.stream().filter(o -> o.getId().toString().contentEquals(token)).findFirst();
		if(tokenO.isPresent()) {
			Date currentTime=new Date(System.currentTimeMillis());
			if(tokenO.get().getLimit().after(currentTime)) {
				return ResponseEntity.ok(tokenO.get().getUserID());
			}else {
				adminTokens.remove(tokenO.get());
				return ResponseEntity
			            .status(HttpStatus.GONE)
			            .body("La sesión ha expirado por razones de seguridad. Por favor, inicie sesión nuevamente.");
			}
		}
		return ResponseEntity
	            .status(HttpStatus.FORBIDDEN)
	            .body("Token inválido");
    }
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/createUserToken")
    public ResponseEntity<String> createUserToken(@RequestParam String id) throws ParseException{
		Date limit=new Date(System.currentTimeMillis()+1000*60*MINUTES);
		UUID tokenID=UUID.randomUUID();
		Token newToken= new Token(tokenID,id,limit);
		userTokens.add(newToken);
		return ResponseEntity.ok(newToken.getId().toString());
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/createAdminToken")
    public ResponseEntity<String> createAdminToken(@RequestParam String id) throws ParseException{
		Date limit=new Date(System.currentTimeMillis()+1000*60*MINUTES);
		UUID tokenID=UUID.randomUUID();
		Token newToken= new Token(tokenID,id,limit);
		adminTokens.add(newToken);
		return ResponseEntity.ok(newToken.getId().toString());
	}
}
