package com.devs.api.service;

import com.devs.api.entity.SchemaHistory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface SchemaHistoryService {
    void save(SchemaHistory schemaHistory);

    List<SchemaHistory> getSchemaHistoryById(Long schemaId);

    Optional<SchemaHistory> findById(Long schemaHistoryId);

    Optional<SchemaHistory> findBySchemaIdAndVersion(Long schemaId, Integer version);
}