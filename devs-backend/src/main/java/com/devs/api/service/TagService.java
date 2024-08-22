package com.devs.api.service;

import com.devs.api.entity.Tag;

import java.util.List;
import java.util.Optional;

public interface TagService {
    List<Tag> getSystemTags();

    Optional<Tag> getTagById(Long id);

    Optional<Tag> getTagByName(String name);

    void createTag(Tag tag);

    void updateTag(Tag tag);

    void deleteTag(Long id);

    void save(Tag tag);

    boolean tagExists(String name);

    Optional<List<Tag>> getTagsByUserId(Long userId);
}