package com.riah.so;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class PythonExecutor {

	public String ejecutar(String code) {
		ProcessBuilder pb=new ProcessBuilder("python3", "-c", code);
		try {
			Process p = pb.start();
			p.waitFor();
			BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
            return output.toString();
		} catch (InterruptedException e) { return null; }
		catch (IOException e) { return null; }
	}
}
