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
import org.springframework.web.bind.annotation.RestController;

import com.riah.model.HospitalDTO;
import com.riah.services.HospitalService;
import com.riah.services.TokenService;

@RestController
@RequestMapping("/hospital")
public class HospitalController {
	
	@Autowired
	private HospitalService hospitalService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/insertHospital")
	public ResponseEntity<String> insertSession(@RequestHeader("Authorization") String token,@RequestBody String hospital) throws ParseException{
		if(!TokenService.checkTokens(token.substring(7),false,false,true)) return ResponseEntity.ofNullable(null);
		String id=hospitalService.insertHospital(hospital);
		return ResponseEntity.ok(id);
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadHospitals")
    public ResponseEntity<List<HospitalDTO>> loadHospitals() throws ParseException{
		List<HospitalDTO> hospitals=hospitalService.loadHospitals();
    	if(!hospitals.isEmpty())
			return ResponseEntity.ok(hospitals);
    	else
    		return ResponseEntity.ofNullable(null);
    }
}
