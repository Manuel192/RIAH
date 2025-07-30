package com.riah.services;

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
import org.springframework.stereotype.Service;
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

@Service
public class TokenService {
	
	private static int MINUTES=30;
	
	private static List<Token> therapistTokens = new ArrayList<>();
	private static List<Token> patientTokens = new ArrayList<>();
	private static List<Token> adminTokens = new ArrayList<>();
	
	@Autowired
	private GameService gameService;
	
    public static String checkPatientToken(String token) throws ParseException{
		Optional<Token> tokenO=patientTokens.stream().filter(o -> o.getId().toString().contentEquals(token)).findFirst();
		if(tokenO.isPresent()) {
			Date currentTime=new Date(System.currentTimeMillis());
			if(tokenO.get().getLimit().after(currentTime)) {
				Date limit=new Date(System.currentTimeMillis()+1000*60*MINUTES);
				patientTokens.remove(tokenO.get());
				tokenO.get().setLimit(limit);
				patientTokens.add(tokenO.get());
				return tokenO.get().getUserID();
			}else {
				patientTokens.remove(tokenO.get());
			}
		}
		return "";
    }
    
    public static String checkTherapistToken(String token) throws ParseException{
		Optional<Token> tokenO=therapistTokens.stream().filter(o -> o.getId().toString().contentEquals(token)).findFirst();
		if(tokenO.isPresent()) {
			Date currentTime=new Date(System.currentTimeMillis());
			if(tokenO.get().getLimit().after(currentTime)) {
				Date limit=new Date(System.currentTimeMillis()+1000*60*MINUTES);
				therapistTokens.remove(tokenO.get());
				tokenO.get().setLimit(limit);
				therapistTokens.add(tokenO.get());
				return tokenO.get().getUserID();
			}else {
				therapistTokens.remove(tokenO.get());
			}
		}
		return "";
    }
	
    public static String checkAdminToken(String token) throws ParseException{
		Optional<Token> tokenO=adminTokens.stream().filter(o -> o.getId().toString().contentEquals(token)).findFirst();
		if(tokenO.isPresent()) {
			Date currentTime=new Date(System.currentTimeMillis());
			if(tokenO.get().getLimit().after(currentTime)) {
				Date limit=new Date(System.currentTimeMillis()+1000*60*MINUTES);
				adminTokens.remove(tokenO.get());
				tokenO.get().setLimit(limit);
				adminTokens.add(tokenO.get());
				tokenO.get().setLimit(limit);
				return tokenO.get().getUserID();
			}else {
				adminTokens.remove(tokenO.get());
			}
		}
		return "";
    }
    
    public String createPatientToken(String id) throws ParseException{
		Date limit=new Date(System.currentTimeMillis()+1000*60*MINUTES);
		UUID tokenID=UUID.randomUUID();
		Token newToken= new Token(tokenID,id,limit);
		patientTokens.add(newToken);
		return newToken.getId().toString();
	}
    
    public String createTherapistToken(String id) throws ParseException{
		Date limit=new Date(System.currentTimeMillis()+1000*60*MINUTES);
		UUID tokenID=UUID.randomUUID();
		Token newToken= new Token(tokenID,id,limit);
		therapistTokens.add(newToken);
		return newToken.getId().toString();
	}
	
    public String createAdminToken(String id) throws ParseException{
		Date limit=new Date(System.currentTimeMillis()+1000*60*MINUTES);
		UUID tokenID=UUID.randomUUID();
		Token newToken= new Token(tokenID,id,limit);
		adminTokens.add(newToken);
		return newToken.getId().toString();
	}
    
    public static boolean checkTokens(String token, boolean checkPatient, boolean checkTherapist, boolean checkAdmin) throws ParseException {
    	if(checkPatient) {
    		if(checkPatientToken(token).length()>0)
    			return true;
    	}
    	if(checkTherapist) {
    		if(checkTherapistToken(token).length()>0)
    			return true;
    	}
    	if(checkAdmin) {
    		if(checkAdminToken(token).length()>0)
    			return true;
    	}
    	return false;
    }

	public String createToken(String id, String role) throws ParseException {
		if(role=="Paciente") {
    		String token=createPatientToken(id);
    		return token;
    	}
		else if(role=="Terapeuta") {
			String token=createTherapistToken(id);
    		return token;
    	}
		else if(role=="Administrador") {
			String token=createAdminToken(id);
    		return token;
    	}
    	return "";
	}
}
