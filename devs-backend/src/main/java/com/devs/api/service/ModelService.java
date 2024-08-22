package com.devs.api.service;

import com.devs.api.entity.Model;
import com.devs.api.entity.Tag;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface ModelService {
    void save(Model model);

    List<Model> getModelsByUserId(Long id);

    void deleteModelById(Long modelId);

    Optional<Model> findById(Long modelId);

    List<Tag> createOrUpdateTags(List<String> tagNames, Long userId);
}
