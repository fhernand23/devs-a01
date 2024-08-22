package com.devs.api.repository;

import com.devs.api.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);

    Optional<List<Tag>> findAllByUserId(Long userId);

    List<Tag> findByUserIdIsNull();

    Tag findByNameAndUserId(String tagName, Long userId);
}