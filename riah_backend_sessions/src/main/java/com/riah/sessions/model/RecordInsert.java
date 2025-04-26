package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Records")
public class RecordInsert {
	private ObjectId _id;
    private List<Object> data;

    public List<Object> getData() {
        return data;
    }
    
    public String getId() {
        return _id.toString();
    }
    
    public RecordInsert(String _id, List<Object> data) {
    	this._id=new ObjectId(_id);
    	this.data=data;
    }
    
    public RecordInsert(byte[] _id, List<Object> data) {
    	this._id=new ObjectId(_id);
    	this.data=data;
    }

	public RecordInsert(List<Object> data) {
		this.data=data;
	}
    
}