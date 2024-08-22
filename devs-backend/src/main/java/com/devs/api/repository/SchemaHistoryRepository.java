package com.devs.api.repository;

import com.devs.api.entity.SchemaHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchemaHistoryRepository extends JpaRepository<SchemaHistory, Long> {
    List<SchemaHistory> findBySchemaId(Long schemaId);

    Optional<SchemaHistory> findBySchemaIdAndVersion(Long schemaId, Integer version);
}