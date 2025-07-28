package com.riah.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Admins")
public class Admin extends User {
	
	@Column(name = "allowed", nullable = false)
    protected boolean allowed;

	public Admin(User user) {
		super.id=user.id;
		super.email=user.email;
		super.password=user.password;
		super.gender=user.gender;
		super.name=user.name;
		this.allowed=false;
	}
	
	public Admin() {
		
	}
}