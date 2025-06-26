package com.riah.sessions.so;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class PythonService {

	public static String buildMethodHeader(String methodName, int parametersLength) {
		String methodHeader="def "+methodName+"(";
		for(int i=0;i<parametersLength;i++) {
			if(i!=0) methodHeader+=",";
			methodHeader+=("p_")+i;
		}
		methodHeader+="):";
		return methodHeader;
	}
	
	public static String execute(String code) {
		List<String> list=new ArrayList<String>();
		list.add("python3");
		list.add("-c");
		list.add(code);
		String[] command=list.toArray(new String[0]);
		ProcessBuilder pb=new ProcessBuilder(command);
		pb.redirectErrorStream(true);
		try {
			Process p = pb.start();
			p.waitFor();
			BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
            	System.out.println(line);
                output.append(line);
            }
            System.out.println(output.toString());
            return output.toString();
		} catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Ocurrió un error: " + e.getMessage());
        }
	}
}
