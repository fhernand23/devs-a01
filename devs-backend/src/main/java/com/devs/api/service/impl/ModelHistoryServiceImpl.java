package com.devs.api.service.impl;

import com.devs.api.entity.ModelHistory;
import com.devs.api.repository.ModelHistoryRepository;
import com.devs.api.service.ModelHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ModelHistoryServiceImpl implements ModelHistoryService {

    private final ModelHistoryRepository modelHistoryRepository;

    @Autowired
    public ModelHistoryServiceImpl(ModelHistoryRepository modelHistoryRepository) {
        this.modelHistoryRepository = modelHistoryRepository;
    }

    @Override
    public void save(ModelHistory modelHistory) {
        modelHistoryRepository.save(modelHistory);
    }

    @Override
    public List<ModelHistory> getModelHistoryByModelId(Long modelId) {
        return modelHistoryRepository.findByModelId(modelId);
    }

    @Override
    public Optional<ModelHistory> findById(Long modelHistoryId) {
        return modelHistoryRepository.findById(modelHistoryId);
    }

    @Override
    public Optional<ModelHistory> findByModelIdAndVersion(Long modelId, Integer version) {
        return modelHistoryRepository.findByModelIdAndVersion(modelId, version);
    }
}