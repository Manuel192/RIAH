package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

public class SessionDTO{
	private String id;
	private String date;
	private Set<String> dataTypes;
    private ArrayList<Frame> frames;
    
    public SessionDTO(String id, String date) {
    	this.id=id;
    	this.date=date;
    	this.frames= new ArrayList<Frame>();
    	this.dataTypes=new HashSet<String>();
    }
    
    public SessionDTO() {
	}

	public String getDate() {
        return date;
    }
    
    public ArrayList<Frame> getFrames() {
        return frames;
    }
    
    public void addDataType(String dataName) {
    	dataTypes.add(dataName);
    }
    
    public void addFrame(Frame frame) {
    	frames.add(frame);
    }
    
    public String getId() {
        return id;
    }
    
	public Set<String> getDataTypes() {
		return dataTypes;
	}

	public void setDataTypes(Set<String> dataTypes) {
		this.dataTypes = dataTypes;
	}
}
