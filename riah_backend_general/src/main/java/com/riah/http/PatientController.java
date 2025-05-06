package com.riah.http;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.dao.SessionDAO;
import com.riah.model.ParameterDTO;
import com.riah.model.PatientDTO;
import com.riah.model.Session;
import com.riah.services.PatientService;
import com.riah.services.SessionService;
import com.riah.model.SessionDTO;

@RestController
@RequestMapping("/patient")
public class PatientController {
	
	@Autowired
	private PatientService patientService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertPatient")
	public ResponseEntity<String> insertSession(@RequestBody String patient){
		String id=patientService.insertSession(patient);
		return ResponseEntity.ok(id);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadParameters")
    public ResponseEntity<List<PatientDTO>> loadPatients() throws ParseException{
		List<PatientDTO> patients=patientService.loadPatients();
    	if(!patients.isEmpty())
			return ResponseEntity.ok(patients);
    	else
    		return ResponseEntity.ofNullable(null);
    }
}
