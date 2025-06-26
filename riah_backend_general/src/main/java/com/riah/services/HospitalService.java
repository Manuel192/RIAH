package com.riah.services;

import java.util.List;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.dao.HospitalDAO;
import com.riah.model.Hospital;
import com.riah.model.HospitalDTO;

@Service
public class HospitalService {
	
	@Autowired
	private HospitalDAO hospitalDAO;

	public String insertHospital(String patient) {
		JSONObject json = new JSONObject(patient);
		String name=json.getString("patient");
		Hospital hospitalToInsert=new Hospital(name);
		Hospital savedHospital=hospitalDAO.save(hospitalToInsert);
		return savedHospital.getId().toString();
	}

	public List<HospitalDTO> loadHospitals() {
		List<Hospital> hospitals= hospitalDAO.findAll();
		if(hospitals.size()==0) return null;
		List<HospitalDTO> parsedHospitals= mapHospitals(hospitals);
		return parsedHospitals;
	}
	
	private List<HospitalDTO> mapHospitals(List<Hospital> hospitals) {
		return hospitals.stream().map(hospital -> {
			HospitalDTO hospitalDTO = new HospitalDTO();
			hospitalDTO.setId(hospital.getId());
			hospitalDTO.setName(hospital.getName());
            return hospitalDTO;
        }).collect(Collectors.toList());
	}
}