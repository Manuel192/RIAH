package com.riah.services;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.dao.PatientDAO;
import com.riah.dao.RecordDAO;
import com.riah.dao.TherapistDAO;
import com.riah.dao.TherapistRequestDAO;
import com.riah.dao.UserDAO;
import com.riah.model.Hospital;
import com.riah.model.Patient;
import com.riah.model.PatientDTO;
import com.riah.model.Recordd;
import com.riah.model.Therapist;
import com.riah.model.TherapistRequest;
import com.riah.model.User;

@Service
public class PatientService {
	
	@Autowired
	private PatientDAO patientDAO;
	
	@Autowired
	private TherapistDAO therapistDAO;
	
	@Autowired
	private TherapistRequestDAO therapistRequestDAO;
	
	@Autowired
	private RecordDAO recordDAO;

	public List<PatientDTO> loadAccessiblePatients(String userID) {
		Therapist therapist=new Therapist(UUID.fromString(userID));
		List<Patient> patients=therapistRequestDAO.findAccessiblePatients(therapist);
		if(patients.size()==0) return null;
		List<PatientDTO> parsedPatients= mapPatients(patients);
		return parsedPatients;
	}
	
	public List<PatientDTO> loadRequestedPatients(String userID) {
		Therapist therapist=new Therapist(UUID.fromString(userID));
		List<Patient> patients=therapistRequestDAO.findRequestedPatients(therapist);
		if(patients.size()==0) return null;
		List<PatientDTO> parsedPatients= mapUnaccessiblePatients(patients);
		return parsedPatients;
	}
	
	public List<PatientDTO> loadHospitalPatients(String userID) {
		Hospital hospital=therapistDAO.findHospitalByID(UUID.fromString(userID));
		List<Patient> patients=patientDAO.findPatientsByHospital(hospital);
		if(patients.size()==0) return null;
		List<PatientDTO> parsedPatients= mapUnaccessiblePatients(patients);
		return parsedPatients;
	}
	
	private List<PatientDTO> mapPatients(List<Patient> patients) {
		return patients.stream().map(patient -> {
			PatientDTO patientDTO = new PatientDTO();
			patientDTO.setId(patient.getId());
			try {
				patientDTO.setName(patient.getName());
			} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException
					| BadPaddingException e) {}
			patientDTO.setGender(patient.getGender());
			patientDTO.setHospital(patient.getHospital().getId().toString());
            return patientDTO;
        }).collect(Collectors.toList());
	}
	
	private List<PatientDTO> mapUnaccessiblePatients(List<Patient> patients) {
		return patients.stream().map(patient -> {
			PatientDTO patientDTO = new PatientDTO();
			try {
				patientDTO.setName(patient.getName());
			} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException
					| BadPaddingException e) {}
			patientDTO.setHospital(patient.getHospital().getId().toString());
            return patientDTO;
        }).collect(Collectors.toList());
	}

	public PatientDTO loadPatient(String patientID) {
		List<Patient> patient=patientDAO.findByID(UUID.fromString(patientID));
		if(patient.size()==0) return null;
		List<PatientDTO> parsedPatients= mapPatients(patient);
		return parsedPatients.get(0);
	}
	
	public boolean acceptRequest(String user, String therapistId) {
		Therapist therapist=new Therapist(UUID.fromString(therapistId));
		Patient patient=new Patient(UUID.fromString(user));
		therapistRequestDAO.updateStateToAccepted(patient,therapist);
		return true;
	}
	
	public boolean rejectRequest(String user, String therapistId) {
		Therapist therapist=new Therapist(UUID.fromString(therapistId));
		Patient patient=new Patient(UUID.fromString(user));
		therapistRequestDAO.deleteByPatientAndTherapist(patient,therapist);
		return true;
	}
}