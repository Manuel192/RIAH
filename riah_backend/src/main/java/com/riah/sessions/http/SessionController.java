package com.riah.sessions.http;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.sessions.model.Session;
import com.riah.sessions.model.SessionDTO;
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
	
	@GetMapping("/loadSessionsRawData")
    public ResponseEntity<List<SessionDTO>> loadSessionsRawData(@RequestParam String firstDate, @RequestParam String lastDate) throws ParseException{
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
		Date date1=sdf.parse(firstDate);
		Date date2=sdf.parse(lastDate);
		if(date1.after(date2))
			return ResponseEntity.ok(null);
		List<SessionDTO> sessions=sessionService.loadSessionsRawData(date1, date2);
    	if(!sessions.isEmpty())
			return ResponseEntity.ok(sessions);
    	else
    		return ResponseEntity.ofNullable(null);
    }
}
