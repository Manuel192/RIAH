package com.riah.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.riah.dao.PatientDAO;
import com.riah.dao.SessionDAO;
import com.riah.model.Game;
import com.riah.model.Hospital;
import com.riah.model.Parameter;
import com.riah.model.ParameterDTO;
import com.riah.model.Patient;
import com.riah.model.PatientDTO;
import com.riah.model.Session;
import com.riah.model.SessionDTO;

import jakarta.annotation.PostConstruct;

@Service
public class PatientService {
	
	@Autowired
	private PatientDAO patientDAO;

	public String insertSession(String patient) {
		JSONObject json = new JSONObject(patient);
		UUID hospitalId=UUID.fromString(json.getString("hospital"));
		String name=json.getString("patient");
		int age=json.getInt("age");
		String gender=json.getString("gender");
		Patient patientToInsert=new Patient(name,age,gender,new Hospital(hospitalId));
		Patient savedPatient=patientDAO.save(patientToInsert);
		return savedPatient.getId().toString();
	}

	public List<PatientDTO> loadPatients() {
		List<Patient> patients= patientDAO.findAll();
		if(patients==null) return null;
		List<PatientDTO> parsedPatients= mapPatients(patients);
		return parsedPatients;
	}
	
	private List<PatientDTO> mapPatients(List<Patient> patients) {
		return patients.stream().map(patient -> {
			PatientDTO patientDTO = new PatientDTO();
			patientDTO.setId(patient.getId());
			patientDTO.setName(patient.getName());
			patientDTO.setGender(patient.getGender());
			patientDTO.setAge(patient.getAge());
			patientDTO.setHospital(patient.getHospital().getName());
            return patientDTO;
        }).collect(Collectors.toList());
	}
}