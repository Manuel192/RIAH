package com.riah.sessions.services;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.bson.types.ObjectId;

import com.riah.sessions.dao.RecordDAO;
import com.riah.sessions.model.RecordDTO;
import com.riah.sessions.model.RecordInsert;
import com.riah.sessions.model.Recordd;
import com.riah.sessions.model.SessionDB;
import com.riah.sessions.model.Graph;

@Service
public class RecordService {
	
	@Autowired
	private RecordDAO recordDAO;
	
	public String insertRecord() {
		String recordID=recordDAO.insertRecord();
		return recordID;
	}

	public RecordDTO loadRecord(String id) throws ParseException {
		Recordd record=recordDAO.loadRecord(id);
		if(record==null) return null;
		List<String> data=record.getData();
		
		RecordDTO parsedRecord=new RecordDTO(record.getId());
		for(int i=0;i<data.size();i++) {
			JSONObject json = new JSONObject(data.get(i));
			String game=json.getString("game");
			String operation=json.getString("operation");
			String initDate=json.getString("initDate");
			String endDate=json.getString("endDate");
			Graph g= new Graph(game,operation,initDate,endDate);
			parsedRecord.addGraph(g);
		}
		return parsedRecord;
	}

	public boolean updateRecord(String record) {
		JSONObject json = new JSONObject(record);
		JSONArray graphs=json.getJSONArray("data");
		String id=json.getString("id");
		RecordInsert recordToUpdate=new RecordInsert(id,graphs.toList());
		recordDAO.updateRecord(recordToUpdate);
		return true;
	}
}