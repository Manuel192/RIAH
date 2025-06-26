package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Service;

import com.riah.sessions.dao.SimpleOperationDAO;

@Document(collection = "Operations")
public class Operation {
	
	protected ObjectId _id;
	protected List<String> imports;
	protected List<String> method;
	protected String method_name;
	protected List<String> variables;
	protected String method_call;
	
    
	public Operation(List<String> imports, List<String> method, String method_name, List<String> variables,
			String method_call) {
		super();
		this.imports = imports;
		this.method = method;
		this.method_name = method_name;
		this.variables = variables;
		this.method_call = method_call;
	}
	
	public ObjectId get_id() {
		return _id;
	}
	public void set_id(ObjectId _id) {
		this._id = _id;
	}
	public List<String> getImports() {
		return imports;
	}
	public void setImports(List<String> imports) {
		this.imports = imports;
	}
	public List<String> getMethod() {
		return method;
	}
	public void setMethod(List<String> method) {
		this.method = method;
	}
	public String getMethod_name() {
		return method_name;
	}
	public void setMethod_name(String method_name) {
		this.method_name = method_name;
	}
	
	public List<String> getVariables() {
		return variables;
	}
	public void setVariables (List<String> variables) {
		this.variables = variables;
	}
	
	public String getMethod_call() {
		return method_call;
	}
	public void setMethod_call(String method_call) {
		this.method_call = method_call;
	}
	public Operation() {
		// TODO Auto-generated constructor stub
	}
}