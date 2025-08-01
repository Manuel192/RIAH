package com.riah.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.riah.model.Game;

@Repository
public interface GameDAO extends JpaRepository<Game, Integer> {

}