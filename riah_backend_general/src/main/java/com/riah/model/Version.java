package com.riah.model;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "Versions")
public class Version {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "date")
    private Date date;
    
    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;
    
    public Game getGame() {
		return game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

	@PrePersist
    public void prePersist() {
      id = UUID.randomUUID();
      date=new Date(System.currentTimeMillis());
    }
    
    public Version(UUID id) {
    	this.id=id;
    }
    
    public Version(String name, Game game) {
    	this.name=name;
    	this.game=game;
    }
    
    public Version() {}

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Version(String name) {
		this.name = name;
	}
}