package com.riah.sessions.dao;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.riah.sessions.model.Session;

@Repository
public class SessionDAO {
	
	@Autowired
	MongoTemplate mongoTemplate;
    
	public List<Session> example(){
		return mongoTemplate.findAll(Session.class);
	}

	public Session loadSessionRawData(UUID id) {
		Query query = new Query(Criteria.where("ID").is(id.toString()));
		return mongoTemplate.findOne(query, Session.class);
	}
}