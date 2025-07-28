package com.riah.dao;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.Hospital;
import com.riah.model.Patient;
import com.riah.model.Therapist;
import com.riah.model.TherapistRequest;
import com.riah.model.User;

import jakarta.transaction.Transactional;

@Repository
public interface TherapistRequestDAO extends JpaRepository<TherapistRequest, Integer> {

	@Query("SELECT tr.patient FROM TherapistRequest tr WHERE tr.therapist=:therapist AND tr.allowed=true")
	List<Patient> findAccessiblePatients(Therapist therapist);
	
	@Query("SELECT tr.patient FROM TherapistRequest tr WHERE tr.therapist=:therapist AND tr.allowed=false")
	List<Patient> findRequestedPatients(Therapist therapist);

	@Query("SELECT tr.therapist FROM TherapistRequest tr WHERE tr.patient=:patient AND tr.allowed=false")
	List<Therapist> findRequestedTherapists(Patient patient);
	
	@Query("SELECT tr.therapist FROM TherapistRequest tr WHERE tr.patient=:patient AND tr.allowed=true")
	List<Therapist> findTherapists(Patient patient);

	@Transactional
	@Modifying
	@Query("UPDATE TherapistRequest tr SET tr.allowed=true WHERE tr.therapist=:therapist AND tr.patient=:patient")
	void updateStateToAccepted(Patient patient, Therapist therapist);

	@Transactional
	@Modifying
	@Query("DELETE FROM TherapistRequest tr WHERE tr.therapist=:therapist AND tr.patient=:patient")
	void deleteByPatientAndTherapist(Patient patient, Therapist therapist);
}