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
	@Table(name = "CalculatedData")
	public class CalculatedData {

		@Id
		@GeneratedValue(strategy = GenerationType.AUTO)
		@Column(name = "id", updatable = false, nullable = false)
	    private UUID id;

	    @Column(name = "name", nullable = false)
	    private String name;
	    
	    @ManyToOne
	    @JoinColumn(name = "game_id", nullable = false)
	    private Game game;
	     
	    @Column(name = "operation", nullable = false)
	    private String operation;

		@Column(name = "parameter1", nullable = false)
	    private String parameter1;
	    
	    @Column(name = "parameter2")
	    private String parameter2;
	    
	    @PrePersist
	    public void prePersist() {
	      id = UUID.randomUUID();
	    } 
	    /*
	    public double result(List<Double> parameter1, List<Double> parameter2) {
	    	switch(operation) {
	    	case MEAN:
	    		return mean(parameter1);
	    	case DIFFERENCE:
	    		return Math.abs(mean(parameter2)-mean(parameter1));
	    	default:
	    		return 0;
	    	}
	    }
	    
	    private double mean(List<Double> values) {
	    	return values
	                .stream()
	                .mapToDouble(a -> a)
	                .average().getAsDouble();
	    }
	    */
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

		public Game getGame() {
			return game;
		}

		public void setGame(Game game) {
			this.game = game;
		}

		public String getOperation() {
			return operation;
		}

		public void setOperation(String operation) {
			this.operation = operation;
		}

		public String getParameter1() {
			return parameter1;
		}

		public void setParameter1(String parameter1) {
			this.parameter1 = parameter1;
		}

		public String getParameter2() {
			return parameter2;
		}

		public void setParameter2(String parameter2) {
			this.parameter2 = parameter2;
		}
	}