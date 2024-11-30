package com.riah.sessions.model;

import java.util.ArrayList;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Sessions")
public class Session {
	private String Date;
    private ArrayList<String> Data;

    public ArrayList<String> getData() {
        return Data;
    }
    
    public String getDate() {
        return Date;
    }
}