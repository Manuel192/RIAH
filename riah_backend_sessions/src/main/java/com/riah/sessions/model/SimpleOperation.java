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

	private String[] parameters;
	private String name;
	private String return_type;
	
	public SimpleOperation() {}
	
	public SimpleOperation(List<String> imports,List<String> method,String method_name, String[] parameters, String name, String return_type) {
		this.imports=imports;
		this.method=method;
		this.method_name=method_name;
		this.parameters=parameters;
		this.name=name;
		this.return_type=return_type;
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

	public String[] getParameters() {
		return this.parameters;
	}

	public void setParameters(String[] parameters) {
		this.parameters = parameters;
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

	public String getReturn_type() {
		return return_type;
	}

	public void setReturn_type(String return_type) {
		this.return_type = return_type;
	}

	public void set_id(ObjectId _id) {
		this._id = _id;
	}
}