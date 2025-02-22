package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.json.JSONArray;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Records")
public class RecordInsert {
	private String ID;
    private List<Object> data;

    public List<Object> getData() {
        return data;
    }
    
    public String getId() {
        return ID;
    }
    
    public RecordInsert(String ID, List<Object> data) {
    	this.ID=ID;
    	this.data=data;
    }
    
}