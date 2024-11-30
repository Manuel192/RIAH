package com.riah.sessions.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

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

	public List<SessionDTO> loadSessionsRawData(Date firstDate, Date lastDate) throws ParseException {
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
		List<Session> sessions= sessionDAO.loadSessionsRawData(firstDate, lastDate);
		if(sessions.isEmpty()) return null;
		
		List<SessionDTO> parsedSessions= new ArrayList<SessionDTO>();
		for(int i=0;i<sessions.size();i++) {
			Session session=sessions.get(i);
			SessionDTO parsedSession=new SessionDTO(session.getId(),session.getDate());
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
			parsedSessions.add(parsedSession);
		}
		return parsedSessions;
	}
	
}