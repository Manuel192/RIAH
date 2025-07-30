package com.riah.dao;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.Hospital;
import com.riah.model.Patient;
import com.riah.model.Therapist;
import com.riah.model.TherapistRequest;
import com.riah.model.User;

@Repository
public interface PatientDAO extends JpaRepository<Patient, Integer> {
	
	@Query("SELECT p FROM Patient p WHERE p.id = :id")
	List<Patient> findByID(UUID id);

	@Query("SELECT p FROM Patient p WHERE p.email = :email AND p.password = :password")
	List<Patient> findByEmailPassword(String email, String password);

	@Query("SELECT p FROM Patient p WHERE p.hospital = :hospital")
	List<Patient> findPatientsByHospital(Hospital hospital);

	@Query("SELECT p FROM Patient p WHERE p.name = :patientName")
	List<Patient> findByName(String patientName);
	
}