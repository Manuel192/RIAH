package com.riah.dao;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.Patient;
import com.riah.model.Session;
import com.riah.model.User;

@Repository
public interface UserDAO extends JpaRepository<User, Integer> {

	@Query("SELECT u FROM User u WHERE u.email =:email")
	List<User> getByEmail (@Param("email") String email);
}