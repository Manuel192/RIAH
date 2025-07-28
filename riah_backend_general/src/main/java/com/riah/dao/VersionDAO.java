package com.riah.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.riah.model.Game;
import com.riah.model.Version;

@Repository
public interface VersionDAO extends JpaRepository<Version, Integer> {

}