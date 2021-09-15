package com.ultrasound.app.exceptions;

public class SubMenuNotFoundException extends RuntimeException{

    public SubMenuNotFoundException(String id) {
        super ("Could not find a SubMenu with the id: " + id);
    }

}
