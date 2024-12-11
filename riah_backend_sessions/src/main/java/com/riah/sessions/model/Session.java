package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.UUID;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Sessions")
public class Session {
	private UUID ID;
    private ArrayList<String> data;

    public ArrayList<String> getData() {
        return data;
    }
    
    public UUID getId() {
        return ID;
    }
}