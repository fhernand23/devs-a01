package com.devs.api.service;

import com.devs.api.entity.ModelHistory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface ModelHistoryService {
    void save(ModelHistory modelHistory);

    List<ModelHistory> getModelHistoryByModelId(Long modelId);

    Optional<ModelHistory> findById(Long modelHistoryId);

    Optional<ModelHistory> findByModelIdAndVersion(Long modelId, Integer version);
}