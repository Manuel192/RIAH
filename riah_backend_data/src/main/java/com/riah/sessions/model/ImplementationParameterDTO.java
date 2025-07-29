package com.riah.sessions.model;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ImplementationParameterDTO{
	@JsonProperty("id")
	private UUID id;

	@JsonProperty("alias")
    private String alias;
	
	@JsonProperty("operation")
	private String operation;
	
	@JsonProperty("parameter")
    private String parameter;
	
	@JsonProperty("version")
    private String version;


	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}
	

	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

	public String getParameter() {
		return parameter;
	}

	public void setParameter(String parameter) {
		this.parameter = parameter;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}
}
