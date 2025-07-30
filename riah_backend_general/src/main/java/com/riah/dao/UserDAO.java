package com.riah.dao;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.Hospital;
import com.riah.model.Patient;
import com.riah.model.Session;
import com.riah.model.User;

@Repository
public interface UserDAO extends JpaRepository<User, Integer> {

	@Query("SELECT u FROM User u WHERE u.email = :email")
	List<User> findByEmail(String email);

	@Query("SELECT u FROM User u WHERE u.name = :name")
	List<User> findByName(String name);

}