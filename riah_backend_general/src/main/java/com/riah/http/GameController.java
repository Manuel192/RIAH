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
	
	@Autowired
	private TokenService tokenService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadGames")
    public ResponseEntity<List<GameDTO>> loadGames(@RequestParam String token) throws ParseException{
		if(tokenService.checkTokens(token,true,true,true)) {
			List<GameDTO> games=gameService.loadGames();
	    	if(!games.isEmpty())
				return ResponseEntity.ok(games);
	    	else
	    		return ResponseEntity.ofNullable(null);
		}
		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadVersions")
    public ResponseEntity<List<VersionDTO>> loadVersions(@RequestParam String token) throws ParseException{
		if(tokenService.checkTokens(token,true,true,true)){
			List<VersionDTO> versions=gameService.loadVersions();
			return ResponseEntity.ok(versions);
		}
		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertGame")
	public ResponseEntity<GameDTO> insertGame(@RequestParam String token, @RequestBody String gameParams) throws ParseException{
		if(tokenService.checkTokens(token,false,false,true)) {
			GameDTO game=gameService.insertGame(gameParams);
			return ResponseEntity.ok(game);
		}
		return ResponseEntity.ofNullable(null);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertVersion")
	public ResponseEntity<String> insertVersion(@RequestParam String token, @RequestBody String version) throws ParseException{
		if(tokenService.checkTokens(token,false,false,true)) {
			String versionID=gameService.insertVersion(version);
			return ResponseEntity.ok(versionID); 
		}
		return ResponseEntity.ofNullable(null);
	}
}
