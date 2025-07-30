package com.riah.sessions.services;

import java.lang.reflect.Type;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Spliterators;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.riah.security.EncryptionService;
import com.riah.sessions.dao.SessionDAO;
import com.riah.sessions.model.Frame;
import com.riah.sessions.model.ImplementationParameterDTO;
import com.riah.sessions.model.OperationDB;
import com.riah.sessions.model.Session;
import com.riah.sessions.model.SessionDB;
import com.riah.sessions.so.PythonService;
import com.riah.sessions.model.SessionDTO;

@Service
public class SessionService {
	
	@Autowired
	private OperationService operationService;
	
	@Autowired
	private SessionDAO sessionDAO;
	
	public SessionDTO loadSessionRawData(String id) throws ParseException, JsonMappingException, JsonProcessingException, InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
		ObjectMapper objectMapper = new ObjectMapper();
		SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd");
		Session session= sessionDAO.loadSessionRawData(id);
		Session readableSession= new Session(EncryptionService.decrypt(session.getData()),EncryptionService.decrypt(session.getParameters()));
		if(session==null) return null;
		
		SessionDTO parsedSession=new SessionDTO();
		ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(readableSession.getData());

        List<String> lines = new ArrayList<>();

        if (root.isArray()) {
            for (JsonNode node : root) {
                lines.add(mapper.writeValueAsString(node));
            }
        }
        
        parsedSession.setDataTypes(StreamSupport.stream(Spliterators.spliteratorUnknownSize(mapper.readTree(lines.get(0)).fieldNames(), 0), false)
                .collect(Collectors.toSet()));
        
		for(int j=0;j<lines.size();j++) {
			Map<String,String> frame=objectMapper.readValue(lines.get(j), HashMap.class);
			parsedSession.addFrame(new Frame(frame));
		}
		return parsedSession;
	}

	public SessionDB loadSessionParameters(String id) throws ParseException, JsonMappingException, JsonProcessingException, InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
		ObjectMapper objectMapper = new ObjectMapper();
		Session session= sessionDAO.loadSessionRawData(id);
		if(session==null) return null;
		@SuppressWarnings("unchecked")
		List<Object> data=objectMapper.readValue(EncryptionService.decrypt(session.getData()), List.class);
		Map<String,String[]> parameters=objectMapper.readValue(EncryptionService.decrypt(session.getParameters()), new TypeReference<Map<String, String[]>>() {});
		SessionDB parsedSession = new SessionDB(data,parameters);
		return parsedSession;
	}
	
	public void checkJSON(String session) {
		JSONObject json = new JSONObject(session);
		JSONArray frames=json.getJSONArray("frames");
		return; 
	}

	public String insertSession(String session) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		JSONObject json = new JSONObject(session);
		JSONArray frames=json.getJSONArray("frames");
		String[] parametersNames=JSONObject.getNames(frames.getJSONObject(0));
		Map<String,String[]> parameters=new HashMap<String,String[]>();
		for(int i=0;i<parametersNames.length;i++) {
			List<String> values=new ArrayList<String>();
			for(int j=0;j<frames.length();j++) {
				values.add(frames.getJSONObject(j).getString(parametersNames[i]));
			}
			parameters.put(parametersNames[i], values.toArray(new String[0]));
		}
		Session sessionToInsert=new Session(EncryptionService.encrypt(frames.toString()), EncryptionService.encrypt(objectMapper.writeValueAsString(parameters)));
		Session savedSession=sessionDAO.insertSession(sessionToInsert);
		return savedSession.get_id().toString(); 
	}

	public Map<String, String> calculateData(String sessionsParameters, String opId) throws ParseException, JsonMappingException, JsonProcessingException, InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, JSONException {
		Map<String, String> results=new HashMap<>();
		JSONObject json = new JSONObject(sessionsParameters);
		JSONArray sessions=json.getJSONArray("sessions");
		JSONArray versions=json.getJSONArray("versions");
		String implementationParameters=json.getJSONArray("implementationParameters").toString();
		JSONObject sessionVersions=json.getJSONObject("sessionVersions");
		
	    Type listType = new TypeToken<List<ImplementationParameterDTO>>() {}.getType();
		List<ImplementationParameterDTO> implementationParametersParsed=new Gson().fromJson(implementationParameters,listType);
		if(implementationParametersParsed.size()==0) {
			return null;
		}
		OperationDB operation=operationService.loadOperation(opId);
		List<String> codeLines=operation.getCode();
		String basicCode="";
		for(int i=0;i<codeLines.size();i++)
			basicCode+=codeLines.get(i)+"\n";
		for(int i=0;i<sessions.length();i++) {
			String code=basicCode;
			String version=sessionVersions.getString(sessions.getString(i));
			
			boolean versionCovered=false;
			for (int j = 0; j < versions.length(); j++) {
	            if (versions.getString(j).equals(version)) {
	            	versionCovered = true;
	                break;
	            }
	        }
			if(!versionCovered) continue;
			
			Map<String,String> versionParsedVariables=new HashMap<>();
			for(ImplementationParameterDTO ip:implementationParametersParsed) {
				if(ip.getVersion().contentEquals(version)){
					versionParsedVariables.put(ip.getAlias(), ip.getParameter());
				}
			}
			SessionDB session=loadSessionParameters(sessions.getString(i));
			List<String> variables=operation.getVariables();
			Map<String,String[]> parameterList=new HashMap<String,String[]>(session.getParameters());
			for(int j=0;j<variables.size();j++) {
				String variable=versionParsedVariables.get(variables.get(j));
				String[] values=parameterList.get(variable);
				code+=variables.get(j)+"=["+String.join(",",values)+"]\n";
			}
			code+=operation.getMethod_call();
			results.put(sessions.get(i).toString(), PythonService.execute(code));
		}
		return results;
	}
	
}