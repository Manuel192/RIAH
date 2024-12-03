package com.riah.sessions.model;

import java.util.ArrayList;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Sessions")
public class Session {
	private String _id;
	private String date;
    private ArrayList<String> data;

    public ArrayList<String> getData() {
        return data;
    }
    
    public String getDate() {
        return date;
    }
    
    public String getId() {
        return _id;
    }
}