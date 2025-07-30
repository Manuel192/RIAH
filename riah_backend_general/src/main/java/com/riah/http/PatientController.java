package com.riah.http;

import java.text.ParseException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.model.PatientDTO;
import com.riah.services.PatientService;
import com.riah.services.TokenService;

@RestController
@RequestMapping("/patient")
public class PatientController {
	
	@Autowired
	private PatientService patientService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadAccessiblePatients")
    public ResponseEntity<List<PatientDTO>> loadAccessiblePatients(@RequestHeader("Authorization") String token,@RequestParam String user) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),false,true,false)) return ResponseEntity.ofNullable(null);
		List<PatientDTO> patients=patientService.loadAccessiblePatients(user);
    	if(!patients.isEmpty())
			return ResponseEntity.ok(patients);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadRequestedPatients")
    public ResponseEntity<List<PatientDTO>> loadRequestedPatients(@RequestHeader("Authorization") String token,@RequestParam String user) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),false,true,false)) return ResponseEntity.ofNullable(null);
		List<PatientDTO> patients=patientService.loadRequestedPatients(user);
    	if(!patients.isEmpty())
			return ResponseEntity.ok(patients);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadHospitalPatients")
    public ResponseEntity<List<PatientDTO>> loadHospitalPatients(@RequestHeader("Authorization") String token,@RequestParam String user) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),false,true,false)) return ResponseEntity.ofNullable(null);
		List<PatientDTO> patients=patientService.loadHospitalPatients(user);
    	if(!patients.isEmpty())
			return ResponseEntity.ok(patients);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadPatient")
    public ResponseEntity<PatientDTO> loadPatient(@RequestHeader("Authorization") String token,@RequestParam String patientID) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),true,true,false)) return ResponseEntity.ofNullable(null);
		PatientDTO patient=patientService.loadPatient(patientID);
    	if(!(patient==null))
			return ResponseEntity.ok(patient);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/acceptRequest")
    public ResponseEntity<String> acceptRequest(@RequestHeader("Authorization") String token,@RequestParam String user, @RequestBody String therapistId) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),true,false,false)) return ResponseEntity.ofNullable(null);
		boolean correctRequest=patientService.acceptRequest(user,therapistId);
    	if(correctRequest)
			return ResponseEntity.ok("");
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/rejectRequest")
    public ResponseEntity<String> rejectRequest(@RequestHeader("Authorization") String token,@RequestParam String user, @RequestBody String therapistId) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),true,false,false)) return ResponseEntity.ofNullable(null);
		boolean correctRequest=patientService.rejectRequest(user,therapistId);
    	if(correctRequest)
			return ResponseEntity.ok("");
    	else
    		return ResponseEntity.ofNullable(null);
    }
}
