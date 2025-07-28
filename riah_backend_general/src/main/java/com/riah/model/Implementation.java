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
	@Table(name = "Implementations")
	public class Implementation {

		@Id
		@GeneratedValue(strategy = GenerationType.AUTO)
		@Column(name = "id", updatable = false, nullable = false)
	    private UUID id;
	    
	    @ManyToOne
	    @JoinColumn(name = "operation_id", nullable = false)
	    private Operation operation;
	     
	    @ManyToOne
	    @JoinColumn(name = "version_id", nullable = false)
	    private Version version;
	    
		@PrePersist
	    public void prePersist() {
	      id = UUID.randomUUID();
	    } 
	    
		public Implementation(UUID id, Operation operation, Version version) {
			this.id = id;
			this.operation = operation;
			this.version = version;
		}

		public Implementation() {
		}

		public Implementation(UUID id) {
			this.id=id;
		}

		public UUID getId() {
			return id;
		} 

		public void setId(UUID id) {
			this.id = id;
		}



		public Operation getOperation() {
			return operation;
		}



		public void setOperation(Operation operation) {
			this.operation = operation;
		}



		public Version getVersion() {
			return version;
		}



		public void setVersion(Version version) {
			this.version = version;
		}
	}