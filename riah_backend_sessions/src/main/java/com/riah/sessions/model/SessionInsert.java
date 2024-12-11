package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.json.JSONArray;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Sessions")
public class SessionInsert {
	private String ID;
    private List<Object> data;

    public List<Object> getData() {
        return data;
    }
    
    public String getId() {
        return ID;
    }
    
    public SessionInsert(String ID, List<Object> data) {
    	this.ID=ID;
    	this.data=data;
    }
    
}