package com.riah.dao;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.Game;
import com.riah.model.Patient;
import com.riah.model.Session;

@Repository
public interface SessionDAO extends JpaRepository<Session, Integer> {
    
    @Query("SELECT s FROM Session s WHERE s.date >=:firstDate AND s.date<=:lastDate AND s.patient=:patientID")
	List<Session> loadDateFilteredSessionsPatient(@Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate, @Param("patientID") Patient patient);

    @Query("SELECT s FROM Session s WHERE s.date >=:firstDate AND s.date<=:lastDate")
	List<Session> loadDateFilteredSessions(@Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate);
    
    @Query("SELECT s FROM Session s, Version v WHERE s.version = v AND v.game = :game AND s.patient=:patientID")
	List<Session> findByGamePatient(@Param("game") Game game, @Param("patientID") Patient patient);
    
    @Query("SELECT s FROM Session s, Version v WHERE s.version = v AND v.game = :game")
	List<Session> findByGame(@Param("game") Game game);
    
    @Query("SELECT s FROM Session s WHERE s.patient=:patientID")
	List<Session> findByPatient(@Param("patientID") Patient patient);
	
}