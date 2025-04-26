package com.riah.sessions.dao;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.bson.types.Binary;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationUpdate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import com.riah.sessions.model.RecordInsert;
import com.riah.sessions.model.Recordd;
import com.riah.sessions.model.Session;
import com.riah.sessions.model.SessionDB;

import jakarta.servlet.http.HttpServletResponse;

@Repository
public class VideoDAO {
	
	private final GridFSBucket gridFSBucket;
	
	 @Autowired
    public VideoDAO(MongoDatabaseFactory mongoDatabaseFactory) {
        this.gridFSBucket = GridFSBuckets.create(mongoDatabaseFactory.getMongoDatabase());
    }

	 public void loadVideo(String id, HttpServletResponse response) throws IOException {
        try (InputStream inputStream = gridFSBucket.openDownloadStream(new ObjectId(id))) {
            response.setContentType("video/mp4");
            response.setHeader("Content-Disposition", "inline; filename=video.mp4");
            response.setHeader("Accept-Ranges", "bytes");
            inputStream.transferTo(response.getOutputStream());
        }
    }

	public String uploadVideo(MultipartFile file) throws IOException {
        GridFSUploadOptions options = new GridFSUploadOptions();
        ObjectId fileId = gridFSBucket.uploadFromStream(file.getOriginalFilename(), file.getInputStream(), options);
        return fileId.toHexString();
    }
}