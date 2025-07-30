package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Sessions")
public class Session {
	private ObjectId _id;
    private String data;
    private String parameters;

    public String getData() {
        return data;
    }
    
    public Session(String data, String parameters) {
    	this.data=data;
    	this.parameters=parameters;
    }

	public ObjectId get_id() {
		return _id;
	}

	public void set_id(ObjectId _id) {
		this._id = _id;
	}

	public String getParameters() {
		return parameters;
	}

	public void setParameters(String parameters) {
		this.parameters = parameters;
	}

	public void setData(String data) {
		this.data = data;
	}
}