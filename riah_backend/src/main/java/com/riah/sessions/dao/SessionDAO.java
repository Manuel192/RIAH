package com.riah.sessions.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.riah.sessions.model.Session;

@Repository
public interface SessionDAO extends JpaRepository<Session, Integer> {

}