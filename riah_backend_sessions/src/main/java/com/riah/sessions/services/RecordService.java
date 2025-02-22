package com.riah.sessions.services;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.sessions.dao.RecordDAO;
import com.riah.sessions.model.RecordDTO;
import com.riah.sessions.model.RecordInsert;
import com.riah.sessions.model.Recordd;
import com.riah.sessions.model.SessionInsert;
import com.riah.sessions.model.Graph;

@Service
public class RecordService {
	
	@Autowired
	private RecordDAO recordDAO;

	public RecordDTO loadRecord() throws ParseException {
		Recordd record=recordDAO.loadRecord();
		if(record==null) return null;
		List<String> data=record.getData();
		
		RecordDTO parsedRecord=new RecordDTO(record.getId());
		for(int i=0;i<data.size();i++) {
			JSONObject json = new JSONObject(data.get(i));
			String game=json.getString("game");
			String calculatedData=json.getString("calculatedData");
			String initDate=json.getString("initDate");
			String endDate=json.getString("endDate");
			Graph g= new Graph(game,calculatedData,initDate,endDate);
			parsedRecord.addGraph(g);
		}
		return parsedRecord;
	}

	public boolean updateRecord(String record) {
		JSONObject json = new JSONObject(record);
		JSONArray graphs=json.getJSONArray("data");
		RecordInsert recordToUpdate=new RecordInsert(json.getString("id"),graphs.toList());
		recordDAO.updateRecord(recordToUpdate);
		return true;
	}
}