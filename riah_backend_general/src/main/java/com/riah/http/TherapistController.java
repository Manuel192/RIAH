package com.riah.http;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.riah.model.PatientDTO;
import com.riah.model.TherapistDTO;
import com.riah.services.PatientService;
import com.riah.services.TherapistService;

@RestController
@RequestMapping("/therapist")
public class TherapistController {
	
	@Autowired
	private TherapistService therapistService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/requestPatient")
    public ResponseEntity<String> requestPatient(@RequestParam String user, @RequestBody String patientName) throws ParseException, InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException{
		boolean correctRequest=therapistService.requestPatient(user,patientName);
    	if(correctRequest)
			return ResponseEntity.ok("");
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadRequestedTherapists")
    public ResponseEntity<List<TherapistDTO>> loadRequestedTherapists(@RequestParam String user) throws ParseException{
		List<TherapistDTO> therapists=therapistService.loadRequestedTherapists(user);
    	if(!therapists.isEmpty())
			return ResponseEntity.ok(therapists);
    	else
    		return ResponseEntity.ofNullable(null);
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("/loadTherapists")
    public ResponseEntity<List<TherapistDTO>> loadTherapists(@RequestParam String user) throws ParseException{
		List<TherapistDTO> therapists=therapistService.loadTherapists(user);
    	if(!therapists.isEmpty())
			return ResponseEntity.ok(therapists);
    	else
    		return ResponseEntity.ofNullable(null);
    }
}
