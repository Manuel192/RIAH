package com.riah.model;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GameDTO{
	@JsonProperty("id")
	private UUID id;

	@JsonProperty("name")
    private String name;

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
