package com.riah.dao;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.Game;
import com.riah.model.Session;

@Repository
public interface SessionDAO extends JpaRepository<Session, Integer> {
    
    @Query("SELECT s FROM Session s WHERE s.date >=:firstDate AND s.date<=:lastDate")
	List<Session> loadDateFilteredSessions(@Param("firstDate") Date firstDate, @Param("lastDate") Date lastDate);

    @Query("SELECT s FROM Session s WHERE s.game = :game")
	List<Session> findByGame(@Param("game") Game game);
	
}