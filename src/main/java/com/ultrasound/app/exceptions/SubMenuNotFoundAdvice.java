package com.ultrasound.app.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class SubMenuNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(SubMenuNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String subMenuNotFoundAdvice(SubMenuNotFoundException ex) {
        return ex.getMessage();
    }
}

