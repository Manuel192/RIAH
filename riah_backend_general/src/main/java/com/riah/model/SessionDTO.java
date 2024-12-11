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
	
	@JsonProperty("game")
	private String game;
	
	@JsonProperty("hospital")
	private String hospital;
	
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

	public String getGame() {
		return game;
	}

	public void setGame(String game) {
		this.game = game;
	}

	public String getHospital() {
		return hospital;
	}

	public void setHospital(String hospital) {
		this.hospital = hospital;
	}

	public String getPatient() {
		return patient;
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
