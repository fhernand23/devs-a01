package com.devs.api.controller;

import com.devs.api.entity.Tag;
import com.devs.api.entity.User;
import com.devs.api.service.TagService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    private static final Logger LOGGER = LoggerFactory.getLogger(TagController.class);
    private final TagService tagService;

    @Autowired
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            List<Tag> systemTags = tagService.getSystemTags();
            Optional<List<Tag>> userTagsOptional = tagService.getTagsByUserId(user.getId());

            Set<String> tagNames = new HashSet<>();
            List<Tag> mergedTags = new ArrayList<>();

            for (Tag systemTag : systemTags) {
                if (tagNames.add(systemTag.getName())) {
                    mergedTags.add(systemTag);
                }
            }

            if (userTagsOptional.isPresent()) {
                for (Tag userTag : userTagsOptional.get()) {
                    if (tagNames.add(userTag.getName())) {
                        mergedTags.add(userTag);
                    }
                }
            }

            return ResponseEntity.ok(mergedTags);
        } catch (Exception e) {
            LOGGER.error("Error in getAllTags", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<Tag>> getSystemTags() {
        try {
            List<Tag> tags = tagService.getSystemTags();
            return ResponseEntity.ok(tags);
        } catch (Exception e) {
            LOGGER.error("Error in getSystemTags", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable Long id) {
        try {
            Optional<Tag> tag = tagService.getTagById(id);
            return tag.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            LOGGER.error("Error in getTagById", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> createTag(@RequestParam("name") String name, Authentication authentication) {
        try {
            if (tagService.tagExists(name)) {
                return ResponseEntity.badRequest().body("Tag with name '" + name + "' already exists.");
            }

            Tag tag = new Tag();
            tag.setName(name);
            tag.setCreateDate(new Date());

            tagService.save(tag);

            return ResponseEntity.ok("Tag uploaded successfully!");
        } catch (Exception e) {
            LOGGER.error("Error in createTag", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> updateTag(@PathVariable Long id, @RequestParam(value = "name", required = false) String name) {
        try {
            Optional<Tag> optionalTag = tagService.getTagById(id);

            if (optionalTag.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tag not found.");
            }

            Tag existingTag = optionalTag.get();

            if (name != null) {
                existingTag.setName(name);
            }

            existingTag.setUpdateDate(new Date());
            tagService.save(existingTag);

            return ResponseEntity.ok("Tag updated successfully!");
        } catch (Exception e) {
            LOGGER.error("Error in updateTag", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteTag(@PathVariable Long id) {
        try {
            Optional<Tag> tag = tagService.getTagById(id);
            if (tag.isPresent()) {
                tagService.deleteTag(id);
                return ResponseEntity.ok("Tag deleted successfully!");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            LOGGER.error("Error in deleteTag", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}