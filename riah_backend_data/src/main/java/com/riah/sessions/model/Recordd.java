package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.UUID;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Records")
public class Recordd {
	private String _id;
    private ArrayList<String> data;

    public ArrayList<String> getData() {
        return data;
    }
    
    public String getId() {
        return _id;
    }
    
    public Recordd(String _id, ArrayList<String> data) {
    	this._id=_id;
    	this.data=data;
    }
    
}