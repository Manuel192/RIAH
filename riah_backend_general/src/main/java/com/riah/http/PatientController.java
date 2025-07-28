package com.riah.http;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.model.PatientDTO;
import com.riah.services.PatientService;

@RestController
@RequestMapping("/patient")
public class PatientController {
	
	@Autowired
	private PatientService patientService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadAccessiblePatients")
    public ResponseEntity<List<PatientDTO>> loadAccessiblePatients(@RequestParam String user) throws ParseException{
		List<PatientDTO> patients=patientService.loadAccessiblePatients(user);
    	if(!patients.isEmpty())
			return ResponseEntity.ok(patients);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadRequestedPatients")
    public ResponseEntity<List<PatientDTO>> loadRequestedPatients(@RequestParam String user) throws ParseException{
		List<PatientDTO> patients=patientService.loadRequestedPatients(user);
    	if(!patients.isEmpty())
			return ResponseEntity.ok(patients);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadHospitalPatients")
    public ResponseEntity<List<PatientDTO>> loadHospitalPatients(@RequestParam String user) throws ParseException{
		List<PatientDTO> patients=patientService.loadHospitalPatients(user);
    	if(!patients.isEmpty())
			return ResponseEntity.ok(patients);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadPatient")
    public ResponseEntity<PatientDTO> loadPatient(@RequestParam String patientID) throws ParseException{
		PatientDTO patient=patientService.loadPatient(patientID);
    	if(!(patient==null))
			return ResponseEntity.ok(patient);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/acceptRequest")
    public ResponseEntity<String> acceptRequest(@RequestParam String user, @RequestBody String therapistId) throws ParseException{
		boolean correctRequest=patientService.acceptRequest(user,therapistId);
    	if(correctRequest)
			return ResponseEntity.ok("");
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/rejectRequest")
    public ResponseEntity<String> rejectRequest(@RequestParam String user, @RequestBody String therapistId) throws ParseException{
		boolean correctRequest=patientService.rejectRequest(user,therapistId);
    	if(correctRequest)
			return ResponseEntity.ok("");
    	else
    		return ResponseEntity.ofNullable(null);
    }
}
