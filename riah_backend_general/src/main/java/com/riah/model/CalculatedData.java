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
	    private UUID operation;
	    
		@PrePersist
	    public void prePersist() {
	      id = UUID.randomUUID();
	    } 
		
	    public CalculatedData(String name, Game game, UUID operation) {
			super();
			this.name = name;
			this.game = game;
			this.operation = operation;
		}

		public CalculatedData() {
			super();
		}

		public CalculatedData(UUID id) {
			this.id=id;
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

		public Game getGame() {
			return game;
		}

		public void setGame(Game game) {
			this.game = game;
		}

		public UUID getOperation() {
			return operation;
		}

		public void setOperation(UUID operation) {
			this.operation = operation;
		}
	}