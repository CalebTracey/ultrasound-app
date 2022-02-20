package com.ultrasound.app.exceptions;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class PresignedUrlAdvice {
    @ResponseBody
    @ExceptionHandler(PresignedUrlException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    String preSignedUrlAdvice(@NotNull PresignedUrlException ex) {
        return ex.getMessage();
    }

}
