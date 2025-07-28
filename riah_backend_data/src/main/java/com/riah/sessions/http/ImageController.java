package com.riah.sessions.http;

import com.mongodb.client.gridfs.GridFSBucket;
import com.riah.sessions.services.ImageService;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@RestController
@RequestMapping("/image")
@CrossOrigin
public class ImageController {

    @Autowired
    private ImageService imageService;
    
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam String name, @RequestParam("file") MultipartFile file) {
        try {
            String id = imageService.uploadImage(name, file);
            return ResponseEntity.ok(id);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error subiendo la imagen: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{id}")
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String id) {
        try {
            InputStream stream = imageService.getImage(id);
            return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_JPEG)
            .body(new InputStreamResource(stream));
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }
}