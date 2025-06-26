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
import com.riah.dao.RecordDAO;
import com.riah.model.Hospital;
import com.riah.model.Patient;
import com.riah.model.PatientDTO;
import com.riah.model.Recordd;
import com.riah.model.User;

@Service
public class PatientService {
	
	@Autowired
	private PatientDAO patientDAO;
	
	@Autowired
	private RecordDAO recordDAO;

	public String insertPatient(String patient) {
		JSONObject json = new JSONObject(patient);
		UUID hospitalID=UUID.fromString(json.getString("hospital"));
		UUID userID=UUID.fromString(json.getString("user"));
		String name=json.getString("name");
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
		String dateString=json.getString("birthdate");
		String recordID=json.getString("recordID");
		Date birthdate=null;
		try {
			birthdate = sdf.parse(dateString);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		String gender=json.getString("gender");
		Patient patientToInsert=new Patient(name,birthdate,gender,new Hospital(hospitalID),new User(userID));
		Patient savedPatient=patientDAO.save(patientToInsert);
		Recordd recordToInsert=new Recordd(savedPatient.getId(),recordID);
		recordDAO.save(recordToInsert);
		return savedPatient.getId().toString();
	}

	public List<PatientDTO> loadPatients(String userID) {
		User user=new User(UUID.fromString(userID));
		List<Patient> patients= patientDAO.getByUser(user);
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