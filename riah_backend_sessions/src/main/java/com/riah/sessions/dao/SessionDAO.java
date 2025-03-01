package com.riah.sessions.dao;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.bson.types.Binary;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.riah.sessions.model.Session;
import com.riah.sessions.model.SessionInsert;

@Repository
public class SessionDAO {
	
	@Autowired
	MongoTemplate mongoTemplate;
    
	String sessionsCollection="Sessions";
	
	public List<Session> example(){
		return mongoTemplate.findAll(Session.class, sessionsCollection);
	}

	public Session loadSessionRawData(String id) {
		Query query = new Query(Criteria.where("_id").is(new ObjectId(id)));
		return mongoTemplate.findOne(query, Session.class, sessionsCollection);
	}

	public SessionInsert insertSession(SessionInsert sessionToInsert) {
		return mongoTemplate.save(sessionToInsert, sessionsCollection);
	}
}