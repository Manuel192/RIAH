package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Operations")
public class Operation {
	private String ID;
    private List<String> lines;
	
    public String getID() {
		return ID;
	}
	public void setID(String iD) {
		ID = iD;
	}
	public List<String> getLines() {
		return lines;
	}
	public void setLines(List<String> lines) {
		this.lines = lines;
	}
	public Operation() {
	}
	
	public Operation(String iD, List<String> lines) {
		ID = iD;
		this.lines = lines;
	}
}