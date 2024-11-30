package com.riah.sessions.dao;

import java.util.Date;
import java.util.List;

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

	public List<Session> loadSessionsRawData(Date firstDate, Date lastDate) {
		Query query = new Query(Criteria.where("Date").gte(firstDate).andOperator(Criteria.where("Date").lte(lastDate)));
		return mongoTemplate.find(query, Session.class);
	}
}