package com.riah.sessions.http;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.riah.sessions.model.RecordDTO;
import com.riah.sessions.model.SessionDTO;
import com.riah.sessions.services.RecordService;
import com.riah.sessions.services.SessionService;
import com.riah.sessions.services.TokenAuthService;
import com.riah.sessions.services.VideoService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/video")
public class VideoController {
	
	@Autowired
    private VideoService videoService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping("loadVideo")
    public void loadVideo(@RequestHeader ("Authorization") String token,@RequestParam String id, HttpServletResponse response) {
		if(!TokenAuthService.isValidToken(token.substring(7), true, true, false)) return;
        try {
            videoService.loadVideo(id, response);
        } catch (IOException e) {
            response.setStatus(500);
        }
    }
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/uploadVideo")
    public ResponseEntity<String> uploadVideo(@RequestHeader ("Authorization") String token,@RequestParam("file") MultipartFile file) {
		if(!TokenAuthService.isValidToken(token.substring(7), true, true, false)) return ResponseEntity.ofNullable(null);
        try {
            String videoId = videoService.uploadVideo(file);
            return ResponseEntity.ok(videoId);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error al subir el video: " + e.getMessage());
        }
    }
} 
