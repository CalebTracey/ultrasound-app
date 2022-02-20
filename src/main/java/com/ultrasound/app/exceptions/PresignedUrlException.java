package com.ultrasound.app.exceptions;

public class PresignedUrlException extends RuntimeException {

    public PresignedUrlException(String identifier) {
        super ("Problem fetching presigned url for: " + identifier);
    }

}
