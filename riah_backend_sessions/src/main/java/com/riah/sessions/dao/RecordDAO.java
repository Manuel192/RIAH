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

import com.riah.sessions.model.RecordInsert;
import com.riah.sessions.model.Recordd;
import com.riah.sessions.model.Session;
import com.riah.sessions.model.SessionDB;

@Repository
public class RecordDAO {
	
	@Autowired
	MongoTemplate mongoTemplate;
    
	String recordsCollection="Records";
	
	public void updateRecord(RecordInsert record){
		try {
			Query query=new Query(Criteria.where("_id").is(record.getId()));
			Update update = new Update().set("data", record.getData());
			long updates=mongoTemplate.updateFirst(query, update, recordsCollection).getModifiedCount();
		}
		catch(NullPointerException noId) {
			mongoTemplate.save(record, recordsCollection);
			return;
		}
	}

	public Recordd loadRecord() {
		List<Recordd> record=mongoTemplate.findAll(Recordd.class, recordsCollection);
		return record.getFirst();
	}
}