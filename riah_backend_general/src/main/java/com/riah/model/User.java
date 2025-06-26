package com.riah.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Users")
public class User {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "gender", nullable = false)
    private String gender;
    
    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;
    
    @Column(name = "email", nullable = false)
    private String email;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "is_admin", nullable = false)
    private boolean isAdmin;
    

	public boolean isAdmin() {
		return isAdmin;
	}

	public void setAdmin(boolean isAdmin) {
		this.isAdmin = isAdmin;
	}

	public User(UUID id) {
		this.id=id;
	}
	
	public User() {
		
	}

	public User(String name, String gender, Hospital hospital, String email, String password) {
		this.name=name;
		this.gender=gender;
		this.hospital=hospital;
		this.email=email;
		this.password=password;
		this.isAdmin=false;
	}
	
	public User(UUID id, String name, String gender, Hospital hospital, String email, String password) {
		this.id=id;
		this.name=name;
		this.gender=gender;
		this.hospital=hospital;
		this.email=email;
		this.password=password;
		this.isAdmin=false;
	}

	public User(String email, String password) {
		this.email=email;
		this.password=password;
	}

	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getName() {
		return name;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	
	
}