package com.riah.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.CalculatedData;
import com.riah.model.CalculatedDataParameter;
import com.riah.model.CalculatedDataParameterDTO;
import com.riah.model.Game;
import com.riah.model.Parameter;
import com.riah.model.Session;

@Repository
public interface CalculatedDataParameterDAO extends JpaRepository<CalculatedDataParameter, Integer> {
	@Query("SELECT cp.id, p.name, cp.parameter_order FROM Parameter p JOIN CalculatedDataParameter cp ON cp.parameter=p WHERE cp.calculatedData=:cd ORDER BY cp.parameter_order")
	List<String[]> findParameterNamesByCalculatedData(@Param("cd") CalculatedData cd); 
}