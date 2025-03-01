package com.riah.sessions.services;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import com.riah.sessions.dao.RecordDAO;
import com.riah.sessions.dao.VideoDAO;
import com.riah.sessions.model.RecordDTO;
import com.riah.sessions.model.RecordInsert;
import com.riah.sessions.model.Recordd;
import com.riah.sessions.model.SessionInsert;

import jakarta.servlet.http.HttpServletResponse;

import com.riah.sessions.model.Graph;

@Service
public class VideoService {
	
	 @Autowired
    private VideoDAO videoDAO;

	 public void loadVideo(String id, HttpServletResponse response) throws IOException {
        videoDAO.loadVideo(id, response);
    }

	public String uploadVideo(MultipartFile file) throws IOException {
        return videoDAO.uploadVideo(file);
    }
}