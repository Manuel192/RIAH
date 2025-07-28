package com.riah.sessions.services;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import com.riah.sessions.dao.ImageDAO;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class ImageService {
    
    @Autowired
    private ImageDAO imageDAO;

    public String uploadImage(String name, MultipartFile file) throws IOException {
        return imageDAO.uploadImage(name, file);
    }

	public InputStream getImage(String id) {
		return imageDAO.getImage(id);
	}
}