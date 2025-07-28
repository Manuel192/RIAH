package com.riah.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "TherapistRequests")
public class TherapistRequest {
	
	@Id
    @Column(name = "id", nullable = false, updatable = false)
    protected UUID id;
    
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "therapist_id", nullable = false)
    private Therapist therapist;
    
    @Column(name = "allowed", nullable = false)
    private boolean allowed;
    
    @PrePersist
    public void prePersist() {
      id = UUID.randomUUID();
    } 

	public TherapistRequest() {
		
	}

	public TherapistRequest(Patient patient, Therapist therapist) {
		super();
		this.patient = patient;
		this.therapist = therapist;
		this.allowed = false;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public Therapist getTherapist() {
		return therapist;
	}

	public void setTherapist(Therapist therapist) {
		this.therapist = therapist;
	}

	public boolean isAllowed() {
		return allowed;
	}

	public void setAllowed(boolean allowed) {
		this.allowed = allowed;
	}
}