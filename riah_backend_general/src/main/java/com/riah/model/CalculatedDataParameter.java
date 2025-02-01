package com.riah.model;

import java.util.List;
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
	@Table(name = "CalculatedDataParameters")
	public class CalculatedDataParameter {
		
		public CalculatedDataParameter() {
		}

		@Id
		@GeneratedValue(strategy = GenerationType.AUTO)
		@Column(name = "id", updatable = false, nullable = false)
	    private UUID id;
	    
	    @ManyToOne
	    @JoinColumn(name = "parameter_id", nullable = false)
	    private Parameter parameter;
	    
	    @ManyToOne
	    @JoinColumn(name = "calculatedData_id", nullable = false)
	    private CalculatedData calculatedData; 
	    
	    @Column(name = "parameter_order", nullable = false)
	    private int parameter_order;

		@PrePersist
	    public void prePersist() {
	      id = UUID.randomUUID();
	    } 
		
		public int getOrder() {
			return parameter_order;
		}

		public void setOrder(int order) {
			this.parameter_order = order;
		}
	    
	    public UUID getId() {
			return id;
		} 

		public void setId(UUID id) {
			this.id = id;
		}

		public Parameter getParameter() {
			return parameter;
		}

		public void setParameter(Parameter parameter) {
			this.parameter = parameter;
		}

		public CalculatedData getCalculatedData() {
			return calculatedData;
		}

		public void setCalculatedData(CalculatedData calculatedData) {
			this.calculatedData = calculatedData;
		}
	}