package com.riah.sessions.http;

import com.mongodb.client.gridfs.GridFSBucket;
import com.riah.sessions.services.ImageService;
import com.riah.sessions.services.TokenAuthService;

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
    public ResponseEntity<String> uploadImage(@RequestHeader ("Authorization") String token,@RequestParam String name, @RequestParam("file") MultipartFile file) {
    	if(!TokenAuthService.isValidToken(token.substring(7), false, false, true)) return ResponseEntity.ofNullable(null);
    	try {
            String id = imageService.uploadImage(name, file);
            return ResponseEntity.ok(id);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error subiendo la imagen: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{id}")
    public ResponseEntity<InputStreamResource> getImage(@RequestHeader ("Authorization") String token,@PathVariable String id) {
    	if(!TokenAuthService.isValidToken(token.substring(7), true, true, true)) return ResponseEntity.ofNullable(null);
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