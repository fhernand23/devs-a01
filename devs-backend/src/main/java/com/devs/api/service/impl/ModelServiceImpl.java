package com.devs.api.service.impl;

import com.devs.api.entity.Model;
import com.devs.api.entity.Tag;
import com.devs.api.repository.ModelRepository;
import com.devs.api.repository.TagRepository;
import com.devs.api.service.ModelService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ModelServiceImpl implements ModelService {

    private final ModelRepository modelRepository;

    private final TagRepository tagRepository;

    public ModelServiceImpl(ModelRepository modelRepository, TagRepository tagRepository) {
        this.modelRepository = modelRepository;
        this.tagRepository = tagRepository;
    }

    @Override
    public void save(Model model) {
        modelRepository.save(model);
    }

    @Override
    public List<Model> getModelsByUserId(Long userId) {
        return modelRepository.findByUserId(userId);
    }

    @Override
    public void deleteModelById(Long modelId) {
        modelRepository.deleteById(modelId);
    }

    @Override
    public Optional<Model> findById(Long modelId) {
        return modelRepository.findById(modelId);
    }

    public List<Tag> createOrUpdateTags(List<String> tagNames, Long userId) {
        List<Tag> modelTags = new ArrayList<>();

        for (String tagName : tagNames) {
            Tag existingTag = tagRepository.findByNameAndUserId(tagName, userId);

            if (existingTag != null) {
                existingTag.setUpdateDate(new Date());
                tagRepository.save(existingTag);
                modelTags.add(existingTag);
            } else {
                Tag newTag = new Tag();
                newTag.setName(tagName);
                newTag.setCreateDate(new Date());
                newTag.setUserId(userId);
                tagRepository.save(newTag);
                modelTags.add(newTag);
            }
        }

        return modelTags;
    }
}
