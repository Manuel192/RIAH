package com.riah.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.riah.dao.GameDAO;
import com.riah.dao.SessionDAO;
import com.riah.model.Game;
import com.riah.model.GameDTO;
import com.riah.model.Session;
import com.riah.model.SessionDTO;

import jakarta.annotation.PostConstruct;

@Service
public class GameService {
	
	@Autowired
	private GameDAO gameDAO;
		
	public List<GameDTO> loadGames() throws ParseException {
		List<Game> games= gameDAO.findAll();
		if(games==null) return null;
		List<GameDTO> parsedGames= mapGames(games);
		return parsedGames;
	}

	private List<GameDTO> mapGames(List<Game> games) {
		return games.stream().map(game -> {
            GameDTO gameDTO = new GameDTO();
            gameDTO.setId(game.getId());
            gameDTO.setName(game.getName());
            return gameDTO;
        }).collect(Collectors.toList());
	}
}