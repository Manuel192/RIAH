package com.riah.services;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.riah.dao.ImplementationDAO;
import com.riah.dao.ImplementationParameterDAO;
import com.riah.dao.OperationDAO;
import com.riah.model.Game;
import com.riah.model.Implementation;
import com.riah.model.ImplementationParameter;
import com.riah.model.ImplementationParameterDTO;
import com.riah.model.Operation;
import com.riah.model.OperationDTO;
import com.riah.model.Parameter;
import com.riah.model.Version;

@Service
public class ImplementationService {
	
	@Autowired
	private ImplementationDAO implementationDAO;
	
	@Autowired
	private ImplementationParameterDAO implementationParameterDAO;
	
	@Autowired
	private SessionService sessionService;
	
	public String insertImplementation(String implementation) {
		JSONObject json = new JSONObject(implementation);
		JSONObject implementationParameters = json.getJSONObject("implementationParameters");
		Version version = new Version(UUID.fromString(json.getString("version")));
		Operation operation = new Operation(UUID.fromString(json.getString("operation")));
		List<Implementation> currentImplementation=implementationDAO.findByOperationAndVersion(version, operation);
		Implementation obtainedImplementation=new Implementation();
		if(currentImplementation.size()==0) {
			Implementation implementationToSave=new Implementation(operation,version);
			obtainedImplementation=implementationDAO.save(implementationToSave);
		}else {
			obtainedImplementation=currentImplementation.get(0);
			implementationParameterDAO.deleteByImplementation(obtainedImplementation);
		}
		List<ImplementationParameter> parameters = new ArrayList<>();
		String[] mainIdentifiers=JSONObject.getNames(implementationParameters);
		for(int i=0;i<implementationParameters.length();i++) {
			parameters.add(new ImplementationParameter(mainIdentifiers[i],new Implementation(obtainedImplementation.getId()),new Parameter(UUID.fromString(implementationParameters.getString(mainIdentifiers[i])))));
		}
		implementationParameterDAO.saveAll(parameters);
		return "nice";
	}
	
	private List<ImplementationParameterDTO> mapImplementationParameters(List<ImplementationParameter> ip) {
		List<ImplementationParameterDTO> result= new ArrayList<>();
		for(int i=0;i<ip.size();i++) {
			ImplementationParameterDTO implementationParameterDTO = new ImplementationParameterDTO();
			implementationParameterDTO.setId(ip.get(i).getId());
			implementationParameterDTO.setAlias(ip.get(i).getAlias());
			implementationParameterDTO.setParameter(ip.get(i).getParameter().getName().toString());
			implementationParameterDTO.setVersion(ip.get(i).getImplementation().getVersion().getId().toString());
			implementationParameterDTO.setOperation(ip.get(i).getImplementation().getOperation().getId().toString());
			implementationParameterDTO.setId(ip.get(i).getId());
            result.add(implementationParameterDTO);
		}  
            return result;
	}

	public List<ImplementationParameterDTO> loadImplementationParameters() {
		List<ImplementationParameter> foundParameters=implementationParameterDAO.findAll();
		List<ImplementationParameterDTO> parametersParsed=mapImplementationParameters(foundParameters);
		return parametersParsed;
	}
}