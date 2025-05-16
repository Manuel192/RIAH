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

public class Token {

    private UUID id;

    private String userID;
    
    private Date limit;

	public Token(UUID id) {
		this.id=id;
	}
	
	public Token() {
		
	}

	public Token(UUID id, String userID, Date limit) {
		this.id=id;
		this.userID=userID;
		this.limit=limit;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getUserID() {
		return userID;
	}

	public void setUserID(String userID) {
		this.userID = userID;
	}

	public Date getLimit() {
		return limit;
	}

	public void setLimit(Date limit) {
		this.limit = limit;
	}
	
}