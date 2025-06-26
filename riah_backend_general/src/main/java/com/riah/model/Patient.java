package com.riah.model;

import java.util.Date;
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
@Table(name = "Patients")
public class Patient {

    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "gender", nullable = false)
    private String gender;
    
    @Column(name = "birthdate", nullable = false) 
    private Date birthdate;
    
    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

	public Patient(UUID id) {
		this.id=id;
	}
	
	public Patient() {
		
	}

	public Patient(String name, Date birthdate, String gender, Hospital hospital, User user) {
		this.name=name;
		this.birthdate=birthdate;
		this.gender=gender;
		this.hospital=hospital;
		this.user=user;
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

	public Date getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(Date birthdate) {
		this.birthdate = birthdate;
	}
	
	
}