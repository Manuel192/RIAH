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
import org.springframework.web.bind.annotation.RestController;

import com.riah.model.HospitalDTO;
import com.riah.services.HospitalService;

@RestController
@RequestMapping("/hospital")
public class HospitalController {
	
	@Autowired
	private HospitalService hospitalService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertHospital")
	public ResponseEntity<String> insertSession(@RequestBody String hospital){
		String id=hospitalService.insertHospital(hospital);
		return ResponseEntity.ok(id);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadHospitals")
    public ResponseEntity<List<HospitalDTO>> loadPatients() throws ParseException{
		List<HospitalDTO> hospitals=hospitalService.loadHospitals();
    	if(!hospitals.isEmpty())
			return ResponseEntity.ok(hospitals);
    	else
    		return ResponseEntity.ofNullable(null);
    }
}
