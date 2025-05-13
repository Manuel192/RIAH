package com.riah.model;

import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Sessions")
public class Session {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "date", nullable = false)
    private Date date;
    
    @Column(name = "video_id", nullable = true)
    private String videoID;
    
    @Column(name = "data_id", nullable = true)
    private String dataID;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;
    
    public Session(UUID game, UUID patient, Date date, String videoID, String dataID) {
    	this.game=new Game(game);
    	this.date=date;
    	this.patient=new Patient(patient);
    	this.videoID=videoID;
    	this.dataID=dataID;
    }
    
    public Session() {
    	
    }
 
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

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

	public String getVideoID() {
		return videoID;
	}

	public void setVideoID(String videoID) {
		this.videoID = videoID;
	}
}