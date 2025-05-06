package com.riah.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.Operation;
import com.riah.model.Game;
import com.riah.model.Parameter;
import com.riah.model.Patient;
import com.riah.model.Session;

@Repository
public interface PatientDAO extends JpaRepository<Patient, Integer> {

}