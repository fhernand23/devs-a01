package com.devs.api.service.impl;

import com.devs.api.entity.Schema;
import com.devs.api.repository.SchemaRepository;
import com.devs.api.service.SchemaService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SchemaServiceImpl implements SchemaService {

    private final SchemaRepository schemaRepository;

    public SchemaServiceImpl(SchemaRepository schemaRepository) {
        this.schemaRepository = schemaRepository;
    }

    @Override
    public void save(Schema schema) {
        schemaRepository.save(schema);
    }

    @Override
    public Optional<Schema> findById(Long modelSchemaId) {
        return schemaRepository.findById(modelSchemaId);
    }

    @Override
    public List<Schema> findAll() {
        return schemaRepository.findAll();
    }
}
