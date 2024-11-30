package com.riah.sessions.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.sessions.dao.SessionDAO;
import com.riah.sessions.model.Session;

@Service
public class SessionService {
	
	@Autowired
	private SessionDAO sessionDAO;

	public List<String> example() {
		Session session=sessionDAO.example().getFirst();
		String frame=session.getData().getFirst();
		frame=frame.replace("\"", "").replace("{","").replace("}","");
		List<String> data=List.of(frame.split(", "));
		return data;
	}
	
}