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
public interface TherapistDAO extends JpaRepository<Therapist, Integer> {

	@Query("SELECT t FROM Therapist t WHERE t.email = :email AND t.password = :password")
	List<Therapist> findByEmailPassword(String email, String password);
	
	@Query("SELECT t.hospital FROM Therapist t WHERE t.id = :id")
	Hospital findHospitalByID(UUID id);
}