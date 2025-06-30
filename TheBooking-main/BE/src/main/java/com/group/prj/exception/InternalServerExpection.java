package com.group.prj.exception;

public class InternalServerExpection extends RuntimeException {

    public InternalServerExpection(String message) {
        super(message);
    }

}
