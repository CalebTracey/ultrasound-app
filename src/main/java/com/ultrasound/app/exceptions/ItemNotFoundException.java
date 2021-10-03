package com.ultrasound.app.exceptions;

public class ItemNotFoundException extends RuntimeException{

    public ItemNotFoundException(String itemName, String parentType, String parentName) {
        super ("No items with named " + itemName + " found in " + parentType + " " + parentName);
    }
}
