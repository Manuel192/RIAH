package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Sessions")
public class Session {
	private ObjectId _id;
    private ArrayList<String> data;

    public ArrayList<String> getData() {
        return data;
    }
    
    public Session(ArrayList<String> data) {
    	this.data=data;
    }

	public ObjectId get_id() {
		return _id;
	}

	public void set_id(ObjectId _id) {
		this._id = _id;
	}
    
}