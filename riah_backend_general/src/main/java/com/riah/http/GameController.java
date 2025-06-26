package com.riah.http;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.riah.model.GameDTO;
import com.riah.services.GameService;

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
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertGame")
	public ResponseEntity<GameDTO> insertGame(@RequestBody String name){
		GameDTO game=gameService.insertGame(name);
		return ResponseEntity.ok(game); 
	}
}
