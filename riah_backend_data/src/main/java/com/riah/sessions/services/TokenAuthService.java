package com.riah.sessions.services;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class TokenAuthService {

	   private final static RestTemplate restTemplate = new RestTemplate();
	    private static final String AUTH_URL = System.getProperty("AUTH_URL");

	    public static boolean isValidToken(String token, boolean checkPatient, boolean checkTherapist, boolean checkAdmin) {
            String url = AUTH_URL + token + "&checkPatient=" + checkPatient + "&checkTherapist=" + checkTherapist + "&checkAdmin=" + checkAdmin;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
            
            try {
            	ResponseEntity<String> response = restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        requestEntity,
                        String.class
                    );
            	
            	return response.getStatusCode().is2xxSuccessful();
            }catch (Exception e) {
                return false;
            }
	    }
	}
