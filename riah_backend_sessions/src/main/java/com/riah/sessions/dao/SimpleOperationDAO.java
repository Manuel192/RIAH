package com.riah.sessions.dao;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.bson.types.Binary;
import org.bson.types.ObjectId;
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
import com.riah.sessions.model.SessionDB;
import com.riah.sessions.model.SimpleOperation;

@Repository
public class SimpleOperationDAO {
	
	@Autowired
	MongoTemplate mongoTemplate;
    
	String operationsCollection="SimpleOperations";

	public SimpleOperation loadSimpleOperation(String operation) {
		Query query = new Query(Criteria.where("_id").is(new ObjectId(operation)));
		return mongoTemplate.findOne(query, SimpleOperation.class, operationsCollection);
	}
	
	public List<SimpleOperation> loadSimpleOperations() {
		return mongoTemplate.findAll(SimpleOperation.class, operationsCollection);
	}
	
	public void insertOperation(Operation operationToInsert) {
		mongoTemplate.save(operationToInsert, operationsCollection);
	}
}