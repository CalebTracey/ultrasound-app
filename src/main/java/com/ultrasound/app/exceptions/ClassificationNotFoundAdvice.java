package com.ultrasound.app.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ClassificationNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(ClassificationNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String classificationNotFoundHandler(ClassificationNotFoundException ex) {
        return ex.getMessage();
    }
}

