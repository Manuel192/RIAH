package com.riah.dao;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.riah.model.Game;
import com.riah.model.Version;

@Repository
public interface VersionDAO extends JpaRepository<Version, Integer> {

	@Query("SELECT v FROM Version v, Implementation i, Operation o WHERE o.id=:id AND v=i.version AND i.operation=o")
	List<Version> findVersionsByOperationImplementations(UUID id);

}
