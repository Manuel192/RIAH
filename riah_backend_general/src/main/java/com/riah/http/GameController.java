package com.riah.http;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.model.GameDTO;
import com.riah.services.GameService;
import com.riah.services.TokenService;
import com.riah.model.VersionDTO;

@RestController
@RequestMapping("/game")
public class GameController {
	
	@Autowired
	private GameService gameService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadGames")
    public ResponseEntity<List<GameDTO>> loadGames(@RequestHeader("Authorization") String token) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),true,true,true)) return ResponseEntity.ofNullable(null);
		List<GameDTO> games=gameService.loadGames();
    	if(!games.isEmpty())
			return ResponseEntity.ok(games);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadVersions")
    public ResponseEntity<List<VersionDTO>> loadVersions(@RequestHeader("Authorization") String token) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),true,true,true)) return ResponseEntity.ofNullable(null);
		List<VersionDTO> versions=gameService.loadVersions();
		return ResponseEntity.ok(versions);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertGame")
	public ResponseEntity<GameDTO> insertGame(@RequestHeader("Authorization") String token, @RequestBody String gameParams) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),false,false,true)) return ResponseEntity.ofNullable(null);
		GameDTO game=gameService.insertGame(gameParams);
		return ResponseEntity.ok(game);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertVersion")
	public ResponseEntity<String> insertVersion(@RequestHeader("Authorization") String token, @RequestBody String version) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),false,false,true)) return ResponseEntity.ofNullable(null);
		String versionID=gameService.insertVersion(version);
		return ResponseEntity.ok(versionID); 
	}
}
