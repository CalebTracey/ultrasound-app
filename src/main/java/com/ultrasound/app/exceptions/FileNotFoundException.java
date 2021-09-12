package com.ultrasound.app.exceptions;

public class FileNotFoundException extends RuntimeException {

    public FileNotFoundException(String id) {
        super ("Could not find a File with the id: " + id);
    }

}