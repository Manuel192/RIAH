package com.riah.sessions.http;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.riah.sessions.services.TokenAuthService;

import java.io.*;
import java.nio.file.*;

@RestController
@RequestMapping("/apk")
@CrossOrigin(origins = "http://localhost:3000")
public class APKController {

    private final String uploadDir = "uploads";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadApk(@RequestHeader ("Authorization") String token,@RequestParam("file") MultipartFile file, @RequestParam String name) {
    	if(!TokenAuthService.isValidToken(token.substring(7), false, false, true)) return ResponseEntity.ofNullable(null);
    	try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(name);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok("Archivo subido correctamente");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error al subir el archivo: " + e.getMessage());
        }
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<byte[]> downloadApk(@RequestHeader ("Authorization") String token,@PathVariable String fileName) throws IOException {
    	if(!TokenAuthService.isValidToken(token.substring(7), true, true, true)) return ResponseEntity.ofNullable(null);
    	Path filePath = Paths.get(uploadDir).resolve(fileName);
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        byte[] fileBytes = Files.readAllBytes(filePath);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileBytes);
    }
}