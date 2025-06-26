package com.riah.dao;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.Game;
import com.riah.model.Patient;
import com.riah.model.Recordd;
import com.riah.model.Session;

@Repository
public interface RecordDAO extends JpaRepository<Recordd, Integer> {
    
    @Query("SELECT r FROM Recordd r WHERE r.patient=:patientID")
	List<Recordd> findByPatient(@Param("patientID") Patient patient);
	
}