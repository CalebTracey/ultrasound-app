package com.ultrasound.app.exceptions;

public class SubMenuNotFoundException extends RuntimeException{

    public SubMenuNotFoundException(String identifier) {
        super ("Could not find a SubMenu with the identifier: " + identifier);
    }

}
