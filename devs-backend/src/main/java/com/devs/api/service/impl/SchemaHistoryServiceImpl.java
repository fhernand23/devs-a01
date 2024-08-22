package com.devs.api.service.impl;

import com.devs.api.entity.SchemaHistory;
import com.devs.api.repository.SchemaHistoryRepository;
import com.devs.api.service.SchemaHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SchemaHistoryServiceImpl implements SchemaHistoryService {

    private final SchemaHistoryRepository schemaHistoryRepository;

    @Autowired
    public SchemaHistoryServiceImpl(SchemaHistoryRepository schemaHistoryRepository) {
        this.schemaHistoryRepository = schemaHistoryRepository;
    }

    @Override
    public void save(SchemaHistory schemaHistory) {
        schemaHistoryRepository.save(schemaHistory);
    }

    @Override
    public List<SchemaHistory> getSchemaHistoryById(Long schemaId) {
        return schemaHistoryRepository.findBySchemaId(schemaId);
    }

    @Override
    public Optional<SchemaHistory> findById(Long schemaHistoryId) {
        return schemaHistoryRepository.findById(schemaHistoryId);
    }

    @Override
    public Optional<SchemaHistory> findBySchemaIdAndVersion(Long schemaId, Integer version) {
        return schemaHistoryRepository.findBySchemaIdAndVersion(schemaId, version);
    }
}
