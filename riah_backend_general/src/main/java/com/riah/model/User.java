package com.riah.model;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import com.riah.security.EncryptionService;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "Users")
public class User {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    protected UUID id;

    @Column(name = "name", nullable = false)
    protected String name;
    
    @Column(name = "gender", nullable = false)
    protected String gender;
    
    @Column(name = "email", nullable = false)
    protected String email;
    
    @Column(name = "password", nullable = false)
    protected String password;

	public User(UUID id) {
		this.id=id;
	}
	
	public User() {
		
	}

	public User(String name, String gender, String email, String password) {
		this.name=name;
		this.gender=gender;
		this.email=email;
		this.password=password;
	}
	
	public User(UUID id, String name, String gender, String email, String password) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
		this.id=id;
		this.name=EncryptionService.encrypt(name);
		this.gender=gender;
		this.email=EncryptionService.encrypt(email);
		this.password=EncryptionService.encrypt(password);
	}

	public User(String email, String password) {
		this.email=email;
		this.password=password;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getName() throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
		return EncryptionService.decrypt(name);
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getEmail() throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
		return EncryptionService.decrypt(email);
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
		return EncryptionService.decrypt(password);
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	
	
}