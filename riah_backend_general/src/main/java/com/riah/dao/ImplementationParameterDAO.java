package com.riah.dao;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.Operation;
import com.riah.model.Version;

import jakarta.transaction.Transactional;

import com.riah.model.Game;
import com.riah.model.Implementation;
import com.riah.model.ImplementationParameter;

@Repository
public interface ImplementationParameterDAO extends JpaRepository<ImplementationParameter, Integer> {

	@Transactional
	@Modifying
	@Query("DELETE FROM ImplementationParameter ip WHERE ip.implementation = :obtainedImplementationID")
	void deleteByImplementation(Implementation obtainedImplementationID);
} 