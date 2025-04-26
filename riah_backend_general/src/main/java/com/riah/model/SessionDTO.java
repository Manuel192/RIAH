package com.riah.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SessionDTO{
	@JsonProperty("id")
	private UUID id;
	
	@JsonProperty("date")
	private Date date;
	
	@JsonProperty("video_id")
	private String videoID;
	
	@JsonProperty("data_id")
	private String dataID;
	
	@JsonProperty("game")
	private String game;
	
	@JsonProperty("patient")
    private String patient;

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getDataID() {
		return dataID;
	}

	public void setDataID(String dataID) {
		this.dataID = dataID;
	}

	public String getGame() {
		return game;
	}

	public void setGame(String game) {
		this.game = game;
	}

	public String getPatient() {
		return patient;
	}

	public String getVideoID() {
		return videoID;
	}

	public void setVideoID(String videoID) {
		this.videoID = videoID;
	}

	public void setPatient(String patient) {
		this.patient = patient;
	}
	
	@Override
	public int hashCode(){
	    return Objects.hash(id);
	}
	
	@Override
	public boolean equals(Object obj) {
		if(obj==this) return true;
		SessionDTO session=(SessionDTO) obj;
		return(this.id.equals(session.id));
	}
}
