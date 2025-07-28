package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Operations")
public class OperationDB {
	private ObjectId _id;
    private List<String> code;
    private String method_call;
    private List<String> variables;
	public ObjectId get_id() {
		return _id;
	}
	public void set_id(ObjectId _id) {
		this._id = _id;
	}
	
    public List<String> getCode() {
		return code;
	}
	public void setCode(List<String> code) {
		this.code = code;
	}
	public OperationDB() {
		// TODO Auto-generated constructor stub
	}
	
	public String getMethod_call() {
		return method_call;
	}
	public void setMethod_call(String method_call) {
		this.method_call = method_call;
	}
	public List<String> getVariables() {
		return variables;
	}
	public void setVariables(List<String> variables) {
		this.variables = variables;
	}
	public OperationDB(Operation operation) {
		variables=operation.getVariables();
		List<String> newCode=new ArrayList<String>();
		newCode.addAll(operation.getImports());
		newCode.addAll(operation.getMethod());
		this.method_call="print("+operation.getMethod_call()+")";
		this.code=newCode;
	}
}