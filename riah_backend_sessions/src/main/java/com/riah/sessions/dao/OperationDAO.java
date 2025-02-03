package com.riah.sessions.dao;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationUpdate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.riah.sessions.model.Operation;
import com.riah.sessions.model.RecordInsert;
import com.riah.sessions.model.Recordd;
import com.riah.sessions.model.Session;
import com.riah.sessions.model.SessionInsert;

@Repository
public class OperationDAO {
	
	@Autowired
	MongoTemplate mongoTemplate;
    
	String operationsCollection="Operations";

	public Operation loadOperation(String operation) {
		Query query = new Query(Criteria.where("ID").is(operation));
		return mongoTemplate.findOne(query, Operation.class, operationsCollection);
	}
	
	public void insertOperation(Operation operationToInsert) {
		mongoTemplate.save(operationToInsert, operationsCollection);
	}
}