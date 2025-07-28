package com.riah.model;

import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TherapistDTO {

	@JsonProperty("id")
    private UUID id;

	@JsonProperty("name")
    private String name;
    
	@JsonProperty("gender")
    private String gender;
    
	@JsonProperty("hospital")
    private String hospital;
    

	public TherapistDTO(UUID id) {
		this.id=id;
	}
	
	public TherapistDTO() {
		
	}

	public String getHospital() {
		return hospital;
	}

	public void setHospital(String hospital) {
		this.hospital = hospital;
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

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}
	
	
}