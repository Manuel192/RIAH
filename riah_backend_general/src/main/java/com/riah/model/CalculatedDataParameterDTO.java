package com.riah.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CalculatedDataParameterDTO{
	@JsonProperty("id")
	private String id;

	@JsonProperty("name")
    private String name;
	
	@JsonProperty("parameter_order")
	private int parameter_order;
	
	public CalculatedDataParameterDTO(String id, String name, int parameter_order) {
		this.id = id;
		this.name = name;
		this.parameter_order = parameter_order;
	}

	public String getId() {
		return id;
	}

	public int getParameter_order() {
		return parameter_order;
	}

	public void setParameter_order(int parameter_order) {
		this.parameter_order = parameter_order;
	}

	public void setId(String id) {
		this.id = id;
	}
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
