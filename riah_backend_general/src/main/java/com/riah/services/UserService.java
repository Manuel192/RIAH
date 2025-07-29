package com.riah.services;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Random;
import java.util.UUID;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONException;
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
import com.riah.dao.AdminDAO;
import com.riah.dao.PatientDAO;
import com.riah.dao.TherapistDAO;
import com.riah.dao.UserDAO;
import com.riah.model.Admin;
import com.riah.model.Hospital;
import com.riah.model.Patient;
import com.riah.model.Therapist;
import com.riah.model.User;
import com.riah.security.EncryptionService;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;

import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class UserService {
	
	@Autowired
	private UserDAO userDAO;
	
	@Autowired
	private AdminDAO adminDAO;
	
	@Autowired
	private TherapistDAO therapistDAO;
	
	@Autowired
	private PatientDAO patientDAO;
	
	@Autowired
	private RecordService recordService;
	
	private Map<String,String> codes=new HashMap<String,String>();
	private Map<String, User> temporalUsers=new HashMap<String,User>();
	
	@Value("${spring.mail.username}")
    private String from;
	
	private static final String CLIENT_SECRET_PATH = System.getenv("CLIENT_SECRET_PATH");
    private static final String TOKENS_DIRECTORY = "src/main/resources/Tokens";
    private static final String SCOPE = "https://mail.google.com/";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    
    public boolean insertUser(String user, String code, String role) {
    	JSONObject json = new JSONObject(user);
    	String userID=json.getJSONObject("user").getString("id");
		if(codes.get(userID).contentEquals(code)) {
			if(role.contentEquals("Administrador")) {
				Admin admin = new Admin(temporalUsers.get(userID));
				adminDAO.save(admin);
			}else if(role.contentEquals("Paciente")) {
				Hospital hospital=new Hospital(UUID.fromString(json.getJSONObject("user").getString("hospital")));
				Patient patient = new Patient(temporalUsers.get(userID), hospital);
				patientDAO.save(patient);
			}else if(role.contentEquals("Terapeuta")) {
				Hospital hospital=new Hospital(UUID.fromString(json.getJSONObject("user").getString("hospital")));
				Therapist therapist = new Therapist(temporalUsers.get(userID), hospital);
				therapistDAO.save(therapist);
			}
			return true;
		}else {
			return false;
		}
	}
    
    public static Credential getCredentials() throws Exception {
        NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(
                JSON_FACTORY,
                new InputStreamReader(new FileInputStream(CLIENT_SECRET_PATH))
        );

        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                httpTransport, JSON_FACTORY, clientSecrets, Collections.singleton(SCOPE))
                .setAccessType("offline")
                .setDataStoreFactory(new FileDataStoreFactory(new File(TOKENS_DIRECTORY)))
                .build();

        LocalServerReceiver receiver = new LocalServerReceiver.Builder()
                .setPort(8889)
                .setCallbackPath("/Callback")
                .build();

        return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
    }
	
	public String doubleFactor(String userData) throws JSONException, Exception {
		JSONObject json = new JSONObject(userData);
		String email=json.getString("email");
		List<User> users=userDAO.findByEmail(EncryptionService.encrypt(email));
		if(users.size()>0)
			throw new Exception();
		String name=json.getString("name");
		users=userDAO.findByName(EncryptionService.encrypt(name));
		if(users.size()>0)
			throw new Exception();
		String gender=json.getString("gender");
		String password=json.getString("password");
		UUID userID=UUID.randomUUID();
		
		User user=new User(userID,name,gender,email,password);
		
		Random rand = new Random();
		int max=999999;
		int min=100000;
		String code=(rand.nextInt((max - min) + 1) + min)+"";
		
		String header="Rehab-Inmersive Analysis Hub - Código de registro";
		String content="¡Buenas!\n\n Le llega este correo para verificar que posee el correo electrónico especificado en la página web RIAH. Si usted no realizó tal acción, ignore este correo.\n\n Su código de verificación:\n\n"+code;

		NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(
                JSON_FACTORY, new InputStreamReader(
                        new FileInputStream(CLIENT_SECRET_PATH)
                )
        );

        var credential=getCredentials();
        credential.refreshToken();
        String accessToken = credential.getAccessToken();

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
            transport.connect("smtp.gmail.com", from, accessToken);
            transport.sendMessage(msg, msg.getAllRecipients());
            transport.close();
        }
        codes.put(userID.toString(),code);
        temporalUsers.put(userID.toString(), user);
		return userID.toString();
	}

	public String loginTherapist(String user) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, JSONException {
		JSONObject json = new JSONObject(user);
		String email = EncryptionService.encrypt(json.getString("email"));
		String password = EncryptionService.encrypt(json.getString("password"));
		List<Therapist> foundTherapist = therapistDAO.findByEmailPassword(email,password);
		if(foundTherapist.size()>0) {	
			return foundTherapist.get(0).getId().toString();
		}
		return "";
	}
	
	public String loginAdmin(String user) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, JSONException {
		JSONObject json = new JSONObject(user);
		String email = EncryptionService.encrypt(json.getString("email"));
		String password = EncryptionService.encrypt(json.getString("password"));
		List<Admin> foundAdmin = adminDAO.findByEmailPassword(email,password);
		if(foundAdmin.size()>0) {	
			return foundAdmin.get(0).getId().toString();
		}
		return "";
	}

	public String loginPatient(String user) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, JSONException {
		JSONObject json = new JSONObject(user);
		String email = EncryptionService.encrypt(json.getString("email"));
		String password = EncryptionService.encrypt(json.getString("password"));
		List<Patient> foundPatient = patientDAO.findByEmailPassword(email,password);
		if(foundPatient.size()>0) {	
			return foundPatient.get(0).getId().toString();
		}
		return "";
	}
}