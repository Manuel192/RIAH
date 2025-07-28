package com.riah.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Patients")
public class Patient extends User {
    
    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

	public Patient(Hospital hospital) {
		this.hospital=hospital;
	}
	
	public Patient(UUID id) {
		super.id=id;
	}

	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}

	public Patient() {
		
	}

	public Patient(User user, Hospital hospital) {
		super.id=user.id;
		super.email=user.email;
		super.password=user.password;
		super.gender=user.gender;
		super.name=user.name;
		this.hospital=hospital;
	}
}