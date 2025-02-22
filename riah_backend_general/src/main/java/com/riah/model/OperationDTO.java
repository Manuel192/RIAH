package com.riah.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OperationDTO{
	@JsonProperty("id")
	private UUID id;

	@JsonProperty("name")
    private String name;
	
	@JsonProperty("no_parameters")
	private int noParameters;

	public UUID getId() {
		return id;
	}
	
	public int getNoParameters() {
		return noParameters;
	}

	public void setNoParameters(int noParameters) {
		this.noParameters = noParameters;
	}

	public void setId(UUID id) {
		this.id = id;
	}
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
