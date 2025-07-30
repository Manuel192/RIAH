package com.riah;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvLoader {
    static {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(entry ->
            System.setProperty(entry.getKey(), entry.getValue())
        );
    }
}