package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class RecordDTO{
	private String ID;
    private ArrayList<Graph> graphs;
    
    public RecordDTO(String id) {
    	this.ID=id;
    	this.graphs= new ArrayList<Graph>();
    }
    
    public RecordDTO() {
	}
    
    public ArrayList<Graph> getGraphs() {
        return graphs;
    }
    
    public void addGraph(Graph g) {
    	graphs.add(g);
    }
    
    public String getId() {
        return ID;
    }
}
