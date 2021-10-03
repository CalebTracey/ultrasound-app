package com.ultrasound.app.exceptions;

public class ClassificationNotFoundException extends RuntimeException{

    public ClassificationNotFoundException(String identifier) {
        super ("Could not find a Classification with the identifier: " + identifier);
    }

}
