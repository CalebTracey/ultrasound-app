package com.ultrasound.app.exceptions;

public class CategoryNotFoundException extends RuntimeException {

    public CategoryNotFoundException(String id) {
        super ("Could not find a Category with the id: " + id);
    }

}
