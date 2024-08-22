package com.devs.api.service;

import com.devs.api.entity.Schema;

import java.util.List;
import java.util.Optional;

public interface SchemaService {
    void save(Schema schema);

    Optional<Schema> findById(Long modelSchemaId);

    List<Schema> findAll();
}
