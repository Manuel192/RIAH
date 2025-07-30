package com.riah.dao;

import java.util.List;

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
public interface ImplementationDAO extends JpaRepository<Implementation, Integer> {

	@Query("SELECT i FROM Implementation i WHERE i.version = :version AND i.operation = :operation")
	List<Implementation> findByOperationAndVersion(Version version, Operation operation);
} 