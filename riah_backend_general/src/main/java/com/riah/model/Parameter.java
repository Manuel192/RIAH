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
	@Table(name = "Parameters")
	public class Parameter {

		public Parameter(String name, Version version) {
			this.name = name;
			this.version = version;
		}
		
		public Parameter() {
		}

		public Parameter(UUID id) {
			this.id=id;
		}

		@Id
		@GeneratedValue(strategy = GenerationType.AUTO)
		@Column(name = "id", updatable = false, nullable = false)
	    private UUID id;

	    @Column(name = "name", nullable = false)
	    private String name;
	    
	    @ManyToOne
	    @JoinColumn(name = "version_id", nullable = false)
	    private Version version;
	    
	    @PrePersist
	    public void prePersist() {
	      id = UUID.randomUUID();
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

		public Version getVersion() {
			return version;
		}

		public void setVersion(Version version) {
			this.version = version;
		}
		
	}