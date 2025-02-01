package com.riah.http;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.dao.SessionDAO;
import com.riah.model.Session;
import com.riah.services.SessionService;
import com.riah.model.SessionDTO;

@RestController
@RequestMapping("/session")
public class SessionController {
	
	@Autowired
	private SessionService sessionService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadFilteredSessions")
    public ResponseEntity<List<SessionDTO>> loadFilteredSessions(@RequestParam String firstDate, @RequestParam String lastDate, @RequestParam String gameId) throws ParseException{
		List<SessionDTO> sessions=new ArrayList<SessionDTO>();
		if(firstDate.equals("X") && lastDate.equals("X") && gameId.toString().equals("X")) {
			sessions=sessionService.loadAll();
			if(!sessions.isEmpty())
				return ResponseEntity.ok(sessions);
	    	else
	    		return ResponseEntity.ofNullable(null);
		}
			
		List<SessionDTO> sessionsDate=new ArrayList<SessionDTO>();
		List<SessionDTO> sessionsGame=new ArrayList<SessionDTO>();

		if (!firstDate.equals("X") && !lastDate.equals("X")) {
			SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
			Date date1=sdf.parse(firstDate);
			Date date2=sdf.parse(lastDate);
			if(date1.after(date2))
				return ResponseEntity.ok(null);
			sessionsDate=sessionService.loadDateFilteredSessions(date1, date2);
		}
		if(!gameId.equals("X")) {
			sessionsGame=sessionService.loadGameFilteredSessions(gameId);
		}
		if(firstDate.equals("X") || firstDate.equals("X")) {
			if(!sessionsGame.isEmpty())
				return ResponseEntity.ok(sessionsGame);
	    	else
	    		return ResponseEntity.ofNullable(null);
		}
		if(gameId.equals("X")) 
			return ResponseEntity.ok(sessionsDate);
		sessionsDate.retainAll(sessionsGame);
		if(!sessionsDate.isEmpty())
			return ResponseEntity.ok(sessionsDate);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertSession")
	public ResponseEntity<String> insertSession(@RequestBody String session){
		String id=sessionService.insertSession(session);
		return ResponseEntity.ok(id); 
	}
}
