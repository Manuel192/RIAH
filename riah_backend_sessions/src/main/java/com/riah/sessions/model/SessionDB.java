package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Sessions")
public class SessionDB {
	private ObjectId _id;
    public ObjectId get_id() {
		return _id;
	}

	public void set_id(ObjectId _id) {
		this._id = _id;
	}

	private List<Object> data;
	private Map<String,String[]> parameters;

    public List<Object> getData() {
        return data;
    }
    
    public SessionDB(List<Object> data, Map<String,String[]> parameters) {
    	this.data=data;
    	this.parameters=parameters;
    }

	public Map<String, String[]> getParameters() {
		return parameters;
	}

	public void setData(List<Object> data) {
		this.data = data;
	}

	public void setParameters(Map<String, String[]> parameters) {
		this.parameters = parameters;
	}
    
}