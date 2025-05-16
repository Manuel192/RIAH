package com.riah.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.Patient;
import com.riah.model.User;

@Repository
public interface PatientDAO extends JpaRepository<Patient, Integer> {
	@Query("SELECT p FROM Patient p WHERE p.user=:user")
	List<Patient> getByUser (@Param("user") User user);
}