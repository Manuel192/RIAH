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
	@PostMapping("/insertPatient")
	public ResponseEntity<String> insertSession(@RequestBody String patient){
		String id=patientService.insertPatient(patient);
		return ResponseEntity.ok(id);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadPatients")
    public ResponseEntity<List<PatientDTO>> loadPatients(@RequestParam String user) throws ParseException{
		List<PatientDTO> patients=patientService.loadPatients(user);
    	if(!patients.isEmpty())
			return ResponseEntity.ok(patients);
    	else
    		return ResponseEntity.ofNullable(null);
    }
}
