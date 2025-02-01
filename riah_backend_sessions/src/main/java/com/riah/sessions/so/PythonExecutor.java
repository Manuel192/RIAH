package com.riah.sessions.so;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class PythonExecutor {

	public static String execute(String code, String[] parameters) {
		List<String> list=new ArrayList<String>();
		list.add("python3");
		list.add("-c");
		list.add(code);
		for(int i=0;i<parameters.length;i++) list.add(parameters[i]);
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
            return output.toString();
		} catch (InterruptedException e) { return null; }
		catch (IOException e) { return null; }
	}
}
