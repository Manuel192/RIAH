package com.riah.sessions.services;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.sessions.dao.OperationDAO;
import com.riah.sessions.dao.RecordDAO;
import com.riah.sessions.model.RecordDTO;
import com.riah.sessions.model.RecordInsert;
import com.riah.sessions.model.Recordd;
import com.riah.sessions.model.SessionInsert;
import com.riah.sessions.model.Graph;
import com.riah.sessions.model.Operation;

@Service
public class OperationService {
	
	@Autowired
	private OperationDAO operationDAO;

	public String loadOperation(String operationID) throws ParseException {
		Operation operation=operationDAO.loadOperation(operationID);
		if(operation==null) return null;
		List<String> lines= operation.getLines();
		String result="";
		for(int i=0;i<lines.size();i++)
			result+=lines.get(i)+"\n";
		;
		return result;
	}
	
	public boolean insertOperation(String operation) {
		JSONObject json = new JSONObject(operation);
		String id=json.getString("id");
		String[] lines=json.getString("python").split("\n");
		List<String> parsedLines=Arrays.asList(lines);
		Operation op=new Operation(id,parsedLines);
		operationDAO.insertOperation(op);
		return true;
	}
}