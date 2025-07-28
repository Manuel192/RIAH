package com.riah.services;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.dao.ParameterDAO;
import com.riah.dao.RecordDAO;
import com.riah.model.Game;
import com.riah.model.Parameter;
import com.riah.model.ParameterDTO;
import com.riah.model.Patient;
import com.riah.model.Recordd;
import com.riah.model.User;

@Service
public class RecordService {
	
	@Autowired
	private RecordDAO recordDAO;
		
	public String loadRecord(String patientID) throws ParseException {
		Patient patient=new Patient(UUID.fromString(patientID));
		Recordd recordID= recordDAO.findByPatient(patient).get(0);
		if(recordID==null) {
			return null;
		}
		return recordID.getDataID().toString();
	}

	public String insertRecord(String patient, String dataID) {
		Recordd record=new Recordd(UUID.fromString(patient),dataID);
		Recordd savedRecord= recordDAO.save(record);
		return savedRecord.getId().toString();
	}
}