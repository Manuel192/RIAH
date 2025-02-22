package com.riah.sessions.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Graph {
    private String game;
    private String calculatedData;
    
	public String getGame() {
		return game;
	}
	public void setGame(String game) {
		this.game = game;
	}
	public String getCalculatedData() {
		return calculatedData;
	}
	public void setCalculatedData(String calculatedData) {
		this.calculatedData = calculatedData;
	}
	public Graph(String game, String calculatedData) {
		this.game = game;
		this.calculatedData = calculatedData;
	}
}