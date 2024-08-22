package com.devs.api.validation;

import org.xml.sax.ErrorHandler;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class XMLErrorHandler implements ErrorHandler {
    private final ByteArrayOutputStream validationErrors;

    public XMLErrorHandler(ByteArrayOutputStream validationErrors) {
        this.validationErrors = validationErrors;
    }

    @Override
    public void warning(SAXParseException exception) throws SAXException {
        try {
            handleError("Warning", exception);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void error(SAXParseException exception) throws SAXException {
        try {
            handleError("Error", exception);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void fatalError(SAXParseException exception) throws SAXException {
        try {
            handleError("Fatal Error", exception);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void handleError(String level, SAXParseException exception) throws IOException {
        String errorMessage = level + ": " + exception.getMessage();
        validationErrors.write(errorMessage.getBytes());
        validationErrors.write(System.lineSeparator().getBytes());
    }
}
