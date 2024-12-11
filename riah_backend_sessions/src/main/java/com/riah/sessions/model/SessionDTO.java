package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class SessionDTO{
	private UUID ID;
	private Set<String> dataTypes;
    private ArrayList<Frame> frames;
    
    public SessionDTO(UUID id) {
    	this.ID=id;
    	this.frames= new ArrayList<Frame>();
    	this.dataTypes=new HashSet<String>();
    }
    
    public SessionDTO() {
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
    
    public UUID getId() {
        return ID;
    }
    
	public Set<String> getDataTypes() {
		return dataTypes;
	}

	public void setDataTypes(Set<String> dataTypes) {
		this.dataTypes = dataTypes;
	}
}
