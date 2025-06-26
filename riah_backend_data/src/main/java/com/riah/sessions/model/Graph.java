package com.riah.sessions.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Graph {
    private String game;
    private String operation;
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
	public String getOperation() {
		return operation;
	}
	public void setOperation(String operation) {
		this.operation = operation;
	}
	public Graph(String game, String operation, String idate, String edate) {
		this.game = game;
		this.operation = operation;
		this.initDate = idate;
		this.endDate = edate;
	}
}