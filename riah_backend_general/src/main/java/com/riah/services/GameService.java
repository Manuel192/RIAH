package com.riah.services;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.dao.GameDAO;
import com.riah.dao.VersionDAO;
import com.riah.model.Game;
import com.riah.model.GameDTO;
import com.riah.model.Version;
import com.riah.model.VersionDTO;

@Service
public class GameService {
	
	@Autowired
	private GameDAO gameDAO;
		
	@Autowired
	private VersionDAO versionDAO;
	
	public List<GameDTO> loadGames() throws ParseException {
		List<Game> games= gameDAO.findAll();
		if(games.isEmpty()) return null;
		List<GameDTO> parsedGames= mapGames(games);
		return parsedGames;
	}
	
	public List<VersionDTO> loadVersions() throws ParseException {
		List<Version> versions= versionDAO.findAll();
		if(versions.isEmpty()) return null;
		List<VersionDTO> parsedVersions= mapVersions(versions);
		return parsedVersions;
	}

	private List<GameDTO> mapGames(List<Game> games) {
		return games.stream().map(game -> {
            GameDTO gameDTO = new GameDTO();
            gameDTO.setId(game.getId());
            gameDTO.setName(game.getName());
            gameDTO.setThumbnail(game.getThumbnailID());
            return gameDTO;
        }).collect(Collectors.toList());
	}
	
	private List<VersionDTO> mapVersions(List<Version> versions) {
		return versions.stream().map(version -> {
            VersionDTO versionDTO = new VersionDTO();
            versionDTO.setId(version.getId());
            versionDTO.setName(version.getName());
            versionDTO.setGame(version.getGame().getId().toString());
            versionDTO.setDate(version.getDate());
            return versionDTO;
        }).collect(Collectors.toList());
	}

	public GameDTO insertGame(String gameParams) {
		JSONObject json = new JSONObject(gameParams);
		String parsedName=json.getString("name");
		String parsedThumbnailID=json.getString("thumbnail");
		Game gameToInsert=new Game(parsedName, parsedThumbnailID);
		Game savedGame=gameDAO.save(gameToInsert);
		List<Game> gameToParse=new ArrayList<>();
		gameToParse.add(savedGame);
		List<GameDTO> parsedGame=mapGames(gameToParse);
		return parsedGame.getFirst();
	}
	
	public String insertVersion(String version) {
		JSONObject json = new JSONObject(version);
		String parsedName=json.getString("name");
		String parsedGame=json.getString("game");
		Version versionToSave=new Version(parsedName,new Game(UUID.fromString(parsedGame)));
		Version savedVersion=versionDAO.save(versionToSave);
		return savedVersion.getId().toString();
	}
}