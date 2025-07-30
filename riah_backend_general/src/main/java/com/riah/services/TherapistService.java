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
import com.riah.model.TherapistDTO;
import com.riah.model.TherapistRequest;
import com.riah.model.User;
import com.riah.security.EncryptionService;

@Service
public class TherapistService {
	
	@Autowired
	private PatientDAO patientDAO;
	
	@Autowired
	private TherapistDAO therapistDAO;
	
	@Autowired
	private TherapistRequestDAO therapistRequestDAO;
	
	@Autowired
	private RecordDAO recordDAO;

	public boolean requestPatient(String user, String patientName) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
		Patient patient=patientDAO.findByName(EncryptionService.encrypt(patientName)).get(0);
		Therapist therapist=new Therapist(UUID.fromString(user));
		TherapistRequest tr= new TherapistRequest(patient,therapist);
		therapistRequestDAO.save(tr);
		return true;
	}
	
	public List<TherapistDTO> loadRequestedTherapists(String userID) {
		Patient patient=new Patient(UUID.fromString(userID));
		List<Therapist> therapists=therapistRequestDAO.findRequestedTherapists(patient);
		if(therapists.size()==0) return null;
		List<TherapistDTO> parsedTherapists= mapTherapists(therapists);
		return parsedTherapists;
	}
	
	public List<TherapistDTO> loadTherapists(String userID) {
		Patient patient=new Patient(UUID.fromString(userID));
		List<Therapist> therapists=therapistRequestDAO.findTherapists(patient);
		if(therapists.size()==0) return null;
		List<TherapistDTO> parsedTherapists= mapTherapists(therapists);
		return parsedTherapists;
	}
	
	private List<TherapistDTO> mapTherapists(List<Therapist> therapists) {
		return therapists.stream().map(therapist -> {
			TherapistDTO therapistDTO = new TherapistDTO();
			therapistDTO.setId(therapist.getId());
			try {
				therapistDTO.setName(therapist.getName());
			} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException
					| BadPaddingException e) {}
			therapistDTO.setGender(therapist.getGender());
			therapistDTO.setHospital(therapist.getHospital().getId().toString());
            return therapistDTO;
        }).collect(Collectors.toList());
	}
}