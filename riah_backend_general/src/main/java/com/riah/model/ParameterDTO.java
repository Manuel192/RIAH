package com.riah.model;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ParameterDTO{
	@JsonProperty("id")
	private UUID id;

	@JsonProperty("name")
    private String name;
	
	@JsonProperty("version_id")
	private UUID versionId;

	public UUID getVersionId() {
		return versionId;
	}

	public void setVersionId(UUID versionId) {
		this.versionId = versionId;
	}

	public UUID getId() {
		return id;
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
