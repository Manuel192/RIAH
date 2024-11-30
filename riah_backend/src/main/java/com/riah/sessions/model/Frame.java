package com.riah.sessions.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Frame {
    private Map<String, String> dataValues=new HashMap<String,String>();

    public Map<String, String> getDataValues() {
        return dataValues;
    }
    
    public void addDataValue(String dataName, String dataValue) {
    	dataValues.put(dataName, dataValue);
    }
}