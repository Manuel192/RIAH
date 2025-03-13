package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.riah.sessions.dao.SimpleOperationDAO;

@Document(collection = "SimpleOperations")
public class SimpleOperation extends Operation {

	private int no_parameters;
	private String name;
	
	public SimpleOperation() {}
	
	public SimpleOperation(List<String> imports,List<String> method,String method_name,int no_parameters, String name) {
		this.imports=imports;
		this.method=method;
		this.method_name=method_name;
		this.no_parameters=no_parameters;
		this.name=name;
	}

	public List<String> getImports() {
		return this.imports;
	}

	public void setImports(List<String> imports) {
		this.imports = imports;
	}

	public List<String> getMethod() {
		return this.method;
	}

	public void setMethod(List<String> method) {
		this.method = method;
	}

	public String getMethod_name() {
		return this.method_name;
	}

	public void setMethod_name(String method_name) {
		this.method_name = method_name;
	}

	public int getNo_parameters() {
		return this.no_parameters;
	}

	public void setNo_parameters(int no_parameters) {
		this.no_parameters = no_parameters;
	}
	
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ObjectId get_id() {
		return _id;
	}

	public void set_id(ObjectId _id) {
		this._id = _id;
	}
}