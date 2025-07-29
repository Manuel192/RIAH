package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

public class OperationDTO {
	private String id;
    private String[] variables;
	
	public OperationDTO() {
		
	}
	
	public OperationDTO(String id,String[] variables) {
		this.id=id;
		this.variables=variables;
	}

	public String[] getVariables() {
		return variables;
	}

	public void setVariables(String[] variables) {
		this.variables = variables;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getId() {
		return id;
	}
}