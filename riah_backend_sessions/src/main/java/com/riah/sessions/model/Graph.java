package com.riah.sessions.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Graph {
    private String game;
    private String calculatedData;
    private String initDate;
    private String endDate;
    
	public String getInitDate() {
		return initDate;
	}
	public void setInitDate(String initDate) {
		this.initDate = initDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
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
	public Graph(String game, String calculatedData, String idate, String edate) {
		this.game = game;
		this.calculatedData = calculatedData;
		this.initDate = idate;
		this.endDate = edate;
	}
}