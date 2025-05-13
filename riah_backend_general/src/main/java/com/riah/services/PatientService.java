package com.riah.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.dao.PatientDAO;
import com.riah.model.Hospital;
import com.riah.model.Patient;
import com.riah.model.PatientDTO;

@Service
public class PatientService {
	
	@Autowired
	private PatientDAO patientDAO;

	public String insertPatient(String patient) {
		JSONObject json = new JSONObject(patient);
		UUID hospitalId=UUID.fromString(json.getString("hospital"));
		String name=json.getString("name");
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
		String dateString=json.getString("birthdate");
		Date birthdate=null;
		try {
			birthdate = sdf.parse(dateString);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		String gender=json.getString("gender");
		Patient patientToInsert=new Patient(name,birthdate,gender,new Hospital(hospitalId));
		Patient savedPatient=patientDAO.save(patientToInsert);
		return savedPatient.getId().toString();
	}

	public List<PatientDTO> loadPatients() {
		List<Patient> patients= patientDAO.findAll();
		if(patients.size()==0) return null;
		List<PatientDTO> parsedPatients= mapPatients(patients);
		return parsedPatients;
	}
	
	private List<PatientDTO> mapPatients(List<Patient> patients) {
		return patients.stream().map(patient -> {
			PatientDTO patientDTO = new PatientDTO();
			patientDTO.setId(patient.getId());
			patientDTO.setName(patient.getName());
			patientDTO.setGender(patient.getGender());
			patientDTO.setBirthdate(patient.getBirthdate());
			patientDTO.setHospital(patient.getHospital().getName());
            return patientDTO;
        }).collect(Collectors.toList());
	}
}