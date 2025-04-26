package com.riah.sessions.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

public class SimpleOperationDTO {
	private String id;
    private List<String> imports;
    private String name;
    private List<String> method;
    private String method_name;
    private String[] parameters;
    private String return_type;
	
	public SimpleOperationDTO() {
		
	}
	
	public SimpleOperationDTO(String id,List<String> imports,List<String> method,String methodName, String[] parameters, String name, String return_type) {
		this.id=id;
		this.imports=imports;
		this.method=method;
		this.method_name=method_name;
		this.parameters=parameters;
		this.name=name;
		this.return_type=return_type;
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

	public String[] getParameters() {
		return parameters;
	}

	public void setParameters(String[] parameters) {
		this.parameters = parameters;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getId() {
		return id;
	}

	public String getReturn_type() {
		return return_type;
	}

	public void setReturn_type(String return_type) {
		this.return_type = return_type;
	}

	public void setId(String id) {
		this.id = id;
	}
}