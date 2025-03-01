package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Sessions")
public class SessionInsert {
	private ObjectId _id;
    public ObjectId get_id() {
		return _id;
	}

	public void set_id(ObjectId _id) {
		this._id = _id;
	}

	private List<Object> data;

    public List<Object> getData() {
        return data;
    }
    
    public SessionInsert(List<Object> data) {
    	this.data=data;
    }
    
}