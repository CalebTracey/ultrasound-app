package com.ultrasound.app.exceptions;

public class ClassificationNotFoundException extends RuntimeException{

    public ClassificationNotFoundException(String id) {
        super ("Could not find a Classification with the id: " + id);
    }

}
