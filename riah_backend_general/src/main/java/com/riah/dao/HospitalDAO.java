package com.riah.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.riah.model.Hospital;

@Repository
public interface HospitalDAO extends JpaRepository<Hospital, Integer> {

}