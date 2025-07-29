package com.riah.sessions.services;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.sessions.dao.OperationDAO;
import com.riah.sessions.dao.RecordDAO;
import com.riah.sessions.dao.SimpleOperationDAO;
import com.riah.sessions.model.RecordDTO;
import com.riah.sessions.model.RecordInsert;
import com.riah.sessions.model.Recordd;
import com.riah.sessions.model.SessionDB;
import com.riah.sessions.model.SimpleOperation;
import com.riah.sessions.model.SimpleOperationDTO;
import com.riah.sessions.so.PythonService;
import com.riah.sessions.model.Graph;
import com.riah.sessions.model.Operation;
import com.riah.sessions.model.OperationDB;
import com.riah.sessions.model.OperationDTO;

@Service
public class OperationService {

	@Autowired
	private OperationDAO operationDAO;
	
	@Autowired
	private SimpleOperationDAO soperationDAO;

	public OperationDB loadOperation(String operationID) throws ParseException {
		return operationDAO.loadOperation(operationID);
	}
	
	public SimpleOperationDTO loadSimpleOperation(String operationID) throws ParseException {
		SimpleOperation operation=soperationDAO.loadSimpleOperation(operationID);
		if(operation==null) return null;
		return new SimpleOperationDTO(operation.get_id().toString(),operation.getImports(),operation.getMethod(),operation.getMethod_name(),operation.getParameters(),operation.getName(),operation.getReturn_type());
	}
	
	public List<SimpleOperationDTO> loadSimpleOperations() throws ParseException {
		List<SimpleOperation> operations=soperationDAO.loadSimpleOperations();
		List<SimpleOperationDTO> parsedOperations=mapSimpleOperations(operations);
		return parsedOperations;
	}
	
	public String insertOperation(String operationJson) {
		JSONObject json = new JSONObject(operationJson);
		Operation op= obtainOperationPython(json);
		OperationDB parsedOp=new OperationDB(op);
		OperationDB insertedOperation=operationDAO.insertOperation(parsedOp);
		return insertedOperation.get_id().toString();
	}
	
	public Operation obtainOperationPython(JSONObject json) {
		String simpleOperationId=json.getString("value").split("#")[0];
		JSONArray children=json.getJSONArray("children");
		SimpleOperation so=soperationDAO.loadSimpleOperation(simpleOperationId);
		List<String> imports=new ArrayList<>();
		List<String> method=new ArrayList<>();
		String method_name=so.getName();
		List<String> variables=new ArrayList<String>();
    	imports.addAll(so.getImports());
    	method.add(PythonService.buildMethodHeader(so.getMethod_name(),json.getJSONArray("children").length()));
    	for(int i=0;i<so.getMethod().size();i++)
    		method.add("\t"+so.getMethod().get(i));
    	String method_call=so.getMethod_name()+"(";
    	for(int i=0;i<children.length();i++) {
    		if(i!=0) method_call+=",";
    		JSONObject child=children.getJSONObject(i);
    		String type=child.getString("type");
    		if(type.matches("Operation")) {
    			Operation soc=obtainOperationPython(child);
    			imports.addAll(soc.getImports());
    			method.addAll(soc.getMethod());
    			variables.addAll(soc.getVariables());
    			method_call+=soc.getMethod_call();
    		}else if(type.matches("Parameter")) {
    			String parameterValue=children.getJSONObject(i).getString("value").trim();
    			if(!isNumeric(parameterValue))
    				variables.add(parameterValue);
				method_call+=parameterValue;
			}
    	}
    	method_call+=")";
    	Operation result=new Operation(imports,method,method_name,variables,method_call);
    	return result;
	}
	
    public static boolean isNumeric(String str) {
        try {
            Integer.parseInt(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

	
	private List<SimpleOperationDTO> mapSimpleOperations(List<SimpleOperation> operations) {
		return operations.stream().map(op -> {
			SimpleOperationDTO newOp = new SimpleOperationDTO();
			newOp.setId(op.get_id().toString());
			newOp.setImports(op.getImports());
			newOp.setMethod(op.getMethod());
			newOp.setMethod_name(op.getMethod_name());
            newOp.setParameters(op.getParameters());
            newOp.setName(op.getName());
            newOp.setReturn_type(op.getReturn_type());
            return newOp;
        }).collect(Collectors.toList());
	}
	
	private List<OperationDTO> mapOperations(List<Operation> operations) {
		return operations.stream().map(op -> {
			OperationDTO newOp = new OperationDTO();
			newOp.setId(op.get_id().toString());
            newOp.setVariables(op.getVariables().toArray(new String[0]));
            return newOp;
        }).collect(Collectors.toList());
	}

	public List<OperationDTO> loadOperationsParameters() {
		List<Operation> operations=operationDAO.loadOperationsParameters();
		if(operations==null) return null;
		return mapOperations(operations);
	
	}
}