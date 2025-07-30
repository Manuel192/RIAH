package com.riah.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "Games")
public class Game {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "thumbnail_id", nullable = false)
    private String thumbnailID;
    
    @PrePersist
    public void prePersist() {
      id = UUID.randomUUID();
    }
    
    public String getThumbnailID() {
		return thumbnailID;
	}

	public void setThumbnailID(String thumbnailID) {
		this.thumbnailID = thumbnailID;
	}

	public Game(UUID id) {
    	this.id=id;
    }
    
    public Game() {}

    public UUID getId() {
		return id;
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

	public Game(String name, String thumbnailID) {
		this.name = name;
		this.thumbnailID=thumbnailID;
	}
}