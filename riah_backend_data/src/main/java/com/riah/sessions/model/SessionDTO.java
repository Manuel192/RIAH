package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class SessionDTO{
	private Set<String> dataTypes;
    private ArrayList<Frame> frames;
    
    public SessionDTO() {
    	this.frames= new ArrayList<Frame>();
    	this.dataTypes=new HashSet<String>();
	}
    
    public ArrayList<Frame> getFrames() {
        return frames;
    }
    
    public void addDataType(String dataName) {
    	if(!dataName.isBlank())
    		dataTypes.add(dataName);
    }
    
    public void addFrame(Frame frame) {
    	frames.add(frame);
    }
    
	public Set<String> getDataTypes() {
		return dataTypes;
	}

	public void setDataTypes(Set<String> dataTypes) {
		this.dataTypes = dataTypes;
	}
}
