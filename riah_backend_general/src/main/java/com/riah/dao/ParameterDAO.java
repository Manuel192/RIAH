package com.riah.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.Game;
import com.riah.model.Parameter;
import com.riah.model.Version;

@Repository
public interface ParameterDAO extends JpaRepository<Parameter, Integer> {
	@Query("SELECT p FROM Parameter p WHERE p.version = :version")
	List<Parameter> findByVersion(@Param("version") Version version);
}