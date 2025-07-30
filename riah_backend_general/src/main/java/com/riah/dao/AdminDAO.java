package com.riah.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.Admin;
import com.riah.model.Patient;
import com.riah.model.Therapist;
import com.riah.model.TherapistRequest;
import com.riah.model.User;

@Repository
public interface AdminDAO extends JpaRepository<Admin, Integer> {

	@Query("SELECT a FROM Admin a WHERE a.email = :email AND a.password = :password AND a.allowed = true")
	List<Admin> findByEmailPassword(String email, String password);
	
}