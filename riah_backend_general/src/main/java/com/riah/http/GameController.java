package com.riah.http;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.dao.SessionDAO;
import com.riah.model.GameDTO;
import com.riah.model.Session;
import com.riah.services.GameService;
import com.riah.services.SessionService;
import com.riah.model.SessionDTO;

@RestController
@RequestMapping("/game")
public class GameController {
	
	@Autowired
	private GameService gameService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadGames")
    public ResponseEntity<List<GameDTO>> loadGames() throws ParseException{
		List<GameDTO> games=gameService.loadGames();
    	if(!games.isEmpty())
			return ResponseEntity.ok(games);
    	else
    		return ResponseEntity.ofNullable(null);
    }
}
