package com.riah.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.riah.model.CalculatedData;
import com.riah.model.Game;
import com.riah.model.Session;

@Repository
public interface CalculatedDataDAO extends JpaRepository<CalculatedData, Integer> {
	@Query("SELECT cd FROM CalculatedData cd WHERE cd.game = :game")
	List<CalculatedData> findByGame(@Param("game") Game game);
}