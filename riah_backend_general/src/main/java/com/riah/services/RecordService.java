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

@Service
public class RecordService {
	
	@Autowired
	private RecordDAO recordDAO;
		
	public String loadRecord(String patientID) throws ParseException {
		Patient patient=new Patient(UUID.fromString(patientID));
		Recordd recordID= recordDAO.findByPatient(patient).get(0);
		return recordID.getDataID().toString();
	}
}