package com.devs.api.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

import javax.xml.XMLConstants;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;
import java.io.ByteArrayInputStream;
import java.io.IOException;

public class XMLValidation {
    private static final Logger LOGGER = LoggerFactory.getLogger(XMLValidation.class);
    private static String errorMessage;

    public static boolean validateXMLSchema(byte[] xsdBytes, byte[] xmlBytes) {
        try {
            SchemaFactory factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
            Schema schema = factory.newSchema(new StreamSource(new ByteArrayInputStream(xsdBytes)));
            Validator validator = schema.newValidator();
            validator.validate(new StreamSource(new ByteArrayInputStream(xmlBytes)));
        } catch (IOException | SAXException e) {
            errorMessage = e.getMessage();
            LOGGER.error(errorMessage);
            return false;
        }
        return true;
    }

    public static String getXMLErrorMessage() {
        return errorMessage;
    }
}