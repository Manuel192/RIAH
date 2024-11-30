package com.riah.sessions.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.riah.sessions.model.Session;

@Repository
public class SessionDAO {
	
	@Autowired
	MongoTemplate mongoTemplate;
    
	public List<Session> example(){
		return mongoTemplate.findAll(Session.class);
	}
}