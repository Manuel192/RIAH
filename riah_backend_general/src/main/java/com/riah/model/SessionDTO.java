package com.riah.model;

import java.util.Date;
import java.util.Objects;
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
	
	@JsonProperty("version")
	private String version;
	
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

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
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
