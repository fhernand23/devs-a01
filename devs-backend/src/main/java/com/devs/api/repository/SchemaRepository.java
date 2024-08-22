package com.devs.api.repository;

import com.devs.api.entity.Schema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SchemaRepository extends JpaRepository<Schema, Long> {
    Optional<Schema> findById(Long modelSchemaId);
}
