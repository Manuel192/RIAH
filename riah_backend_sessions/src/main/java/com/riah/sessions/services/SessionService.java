package com.riah.sessions.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.sessions.dao.SessionDAO;
import com.riah.sessions.model.Frame;
import com.riah.sessions.model.Session;
import com.riah.sessions.model.SessionDTO;

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

	public SessionDTO loadSessionRawData(UUID id) throws ParseException {
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
		Session session= sessionDAO.loadSessionRawData(id);
		if(session==null) return null;
		
		SessionDTO parsedSession=new SessionDTO(session.getId());
		for(int j=0;j<session.getData().size();j++) {
			String dataFrame=session.getData().get(j);
			dataFrame=dataFrame.replace("\"", "").replace("{","").replace("}","");
			List<String> data=List.of(dataFrame.split(", "));
			Frame frame=new Frame();
			for(int k=0;k<data.size();k++) {
				frame.addDataValue(data.get(k).split(":")[0], data.get(k).split(":")[1]);
				parsedSession.addDataType(data.get(k).split(":")[0]);
			}
			parsedSession.addFrame(frame);
		}
		return parsedSession;
	}
	
}