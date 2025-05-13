package com.riah.services;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Properties;
import java.util.Random;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.UserCredentials;
import com.riah.dao.UserDAO;
import com.riah.model.Hospital;
import com.riah.model.User;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class UserService {
	
	@Autowired
	private UserDAO userDAO;
	
	@Value("${spring.mail.username}")
    private String from;
	
	private static final String CLIENT_SECRET_PATH = "src/main/resources/client_secret.json";
    private static final String TOKENS_DIRECTORY = "src/main/resources/tokens";
    private static final String SCOPE = "https://mail.google.com/";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

	public String insertUser(String patient) {
		JSONObject json = new JSONObject(patient);
		UUID hospitalId=UUID.fromString(json.getString("hospital"));
		String name=json.getString("name");
		String gender=json.getString("gender");
		String email=json.getString("email");
		String password=json.getString("password");
		User userToInsert=new User(name,gender,new Hospital(hospitalId),email,password);
		User savedUser=userDAO.save(userToInsert);
		return savedUser.getId().toString();
	}
	
	public String doubleFactor(String userData) throws IOException, AddressException, MessagingException, GeneralSecurityException {
		JSONObject json = new JSONObject(userData);
		UUID hospitalId=UUID.fromString(json.getString("hospital"));
		String name=json.getString("name");
		String gender=json.getString("gender");
		String email=json.getString("email");
		String password=json.getString("password");
		User user=new User(name,gender,new Hospital(hospitalId),email,password);
		
		Random rand = new Random();
		int max=999999;
		int min=100000;
		String code=(rand.nextInt((max - min) + 1) + min)+"";
		
		String header="Rehab-Inmersive Analysis Hub - Proceso de registro";
		String content="¡Buenas!\n\n Le llega este correo para verificar que posee el correo electrónico especificado en la página web RIAH. Si usted no realizó tal acción, ignore este correo.\n\n Su código de verificación:\n"+code;
	
		NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(
                JSON_FACTORY, new InputStreamReader(
                        new FileInputStream(CLIENT_SECRET_PATH)
                )
        );

        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                httpTransport, JSON_FACTORY, clientSecrets, Collections.singleton(SCOPE))
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY)))
                .setAccessType("offline")
                .build();

        var receiver = new LocalServerReceiver.Builder()
                .setPort(8888)
                .build();

        var credential = new AuthorizationCodeInstalledApp(
                flow, receiver
        ).authorize("user");
        
        if (credential.getExpiresInSeconds() != null && credential.getExpiresInSeconds() <= 60) {
        	credential.refreshToken();
        }
        
        receiver.stop();

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.auth.mechanisms", "XOAUTH2");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props);

        MimeMessage msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(from));
        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(user.getEmail()));
        msg.setSubject(header);
        msg.setText(content);

        try (Transport transport = session.getTransport("smtp")) {
            transport.connect("smtp.gmail.com", from, credential.getAccessToken());
            transport.sendMessage(msg, msg.getAllRecipients());
            transport.close();
        }
        System.out.println(credential.getAccessToken());
		return code;
	}
}