package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.UUID;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Sessions")
public class Session {
	private String ID;
    private ArrayList<String> data;

    public ArrayList<String> getData() {
        return data;
    }
    
    public String getId() {
        return ID;
    }
    
    public Session(String ID, ArrayList<String> data) {
    	this.ID=ID;
    	this.data=data;
    }
    
}