package com.riah.model;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OperationDTO{
	@JsonProperty("id")
	private UUID id;

	@JsonProperty("name")
    private String name;
	
	@JsonProperty("game_id")
	private UUID gameId;
	
	@JsonProperty("operation")
    private String operation;
	
	@JsonProperty("versions")
	private List<String> versions;
	
	@JsonProperty("sessions")
	private List<String> sessions;
	
	@JsonProperty("session_dates")
    private Map<String,Date> sessionDates;
	
	@JsonProperty("session_versions")
    private Map<String,String> sessionVersions;
    
	public UUID getGameId() {
		return gameId;
	}

	public void setGameId(UUID gameId) {
		this.gameId = gameId;
	}

	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

	public Map<String, Date> getSessionDates() {
		return sessionDates;
	}

	public void setSessionDates(Map<String, Date> sessionDates) {
		this.sessionDates = sessionDates;
	}

	public UUID getId() {
		return id;
	}
	
	public List<String> getSessions() {
		return sessions;
	}

	public void setSessions(List<String> sessions) {
		this.sessions = sessions;
	}

	public void setId(UUID id) {
		this.id = id;
	}
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Map<String, String> getSessionVersions() {
		return sessionVersions;
	}

	public void setSessionVersions(Map<String, String> sessionVersions) {
		this.sessionVersions = sessionVersions;
	}

	public List<String> getVersions() {
		return versions;
	}

	public void setVersions(List<String> versions) {
		this.versions = versions;
	}
}
