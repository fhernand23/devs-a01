package com.devs.api.repository;

import com.devs.api.entity.ModelHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModelHistoryRepository extends JpaRepository<ModelHistory, Long> {
    List<ModelHistory> findByModelId(Long modelId);

    Optional<ModelHistory> findByModelIdAndVersion(Long modelId, Integer version);
}