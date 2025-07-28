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
	@Table(name = "ImplementationParameters")
	public class ImplementationParameter {

		@Id
		@GeneratedValue(strategy = GenerationType.AUTO)
		@Column(name = "id", updatable = false, nullable = false)
	    private UUID id;
		
		@Column(name = "alias", nullable = false)
		private String alias;
	    
	    @ManyToOne
	    @JoinColumn(name = "implementation_id", nullable = false)
	    private Implementation implementation;
	     
	    @ManyToOne
	    @JoinColumn(name = "parameter_id", nullable = false)
	    private Parameter parameter;
	    
		@PrePersist
	    public void prePersist() {
	      id = UUID.randomUUID();
	    }

		public ImplementationParameter(UUID id, String alias, Implementation implementation, Parameter parameter) {
			this.id = id;
			this.alias = alias;
			this.implementation = implementation;
			this.parameter = parameter;
		}

		public ImplementationParameter() {
		}

		public ImplementationParameter(UUID id) {
			this.id=id;
		}

		public UUID getId() {
			return id;
		} 

		public void setId(UUID id) {
			this.id = id;
		}

		public String getAlias() {
			return alias;
		}

		public void setAlias(String alias) {
			this.alias = alias;
		}

		public Implementation getImplementation() {
			return implementation;
		}

		public void setImplementation(Implementation implementation) {
			this.implementation = implementation;
		}

		public Parameter getParameter() {
			return parameter;
		}

		public void setParameter(Parameter parameter) {
			this.parameter = parameter;
		}
	}