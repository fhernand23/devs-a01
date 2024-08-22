package com.devs.api.controller;

import com.devs.api.dto.HistoryDTO;
import com.devs.api.dto.SchemaDTO;
import com.devs.api.entity.Schema;
import com.devs.api.entity.SchemaHistory;
import com.devs.api.entity.User;
import com.devs.api.service.SchemaHistoryService;
import com.devs.api.service.SchemaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/schemas")
public class SchemaController {
    private final SchemaService schemaService;

    private final SchemaHistoryService schemaHistoryService;

    private static final Logger LOGGER = LoggerFactory.getLogger(SchemaController.class);

    public SchemaController(SchemaService schemaService, SchemaHistoryService schemaHistoryService) {
        this.schemaService = schemaService;
        this.schemaHistoryService = schemaHistoryService;
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> uploadSchema(@RequestParam("name") String name,
                                               @RequestParam("file") MultipartFile file,
                                               @RequestParam("description") String description,
                                               Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Schema schema = new Schema();
            schema.setName(name);
            schema.setCreateDate(new Date());
            schema.setVersion(1);
            schema.setUser(user);

            if (!description.isEmpty()) {
                schema.setDescription(description);
            }

            byte[] fileBytes = file.getBytes();
            schema.setSourceFile(fileBytes);

            schemaService.save(schema);
            return ResponseEntity.ok("Schema uploaded successfully!");
        } catch (Exception e) {
            LOGGER.error("Error in uploadSchema: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @PutMapping("/update/{schemaId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> updateSchema(@PathVariable("schemaId") Long schemaId,
                                               @RequestParam(value = "file", required = false)
                                               MultipartFile file,
                                               @RequestParam(value = "name", required = false)
                                               String name,
                                               @RequestParam(value = "description", required = false)
                                               String description,
                                               Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Optional<Schema> optionalSchema = schemaService.findById(schemaId);
            if (optionalSchema.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Schema not found.");
            }

            Schema existingSchema = optionalSchema.get();

            if (name != null) {
                existingSchema.setName(name);
            }

            if (description != null) {
                existingSchema.setDescription(description);
            }

            if (file != null && !file.isEmpty()) {
                byte[] fileBytes = file.getBytes();

                if (!Arrays.equals(fileBytes, existingSchema.getSourceFile())) {
                    // Update schema history
                    SchemaHistory schemaHistory = new SchemaHistory();
                    schemaHistory.setSchema(existingSchema);
                    schemaHistory.setSourceFile(existingSchema.getSourceFile());
                    schemaHistory.setVersion(existingSchema.getVersion());
                    schemaHistory.setCreateDate(existingSchema.getCreateDate());
                    schemaHistory.setUpdateDate(new Date());
                    schemaHistory.setUser(existingSchema.getUser());
                    schemaHistoryService.save(schemaHistory);

                    // Update current schema
                    existingSchema.setSourceFile(fileBytes);
                    existingSchema.setVersion(existingSchema.getVersion() + 1);
                    existingSchema.setUser(user);
                }
            }

            existingSchema.setUpdateDate(new Date());
            schemaService.save(existingSchema);

            return ResponseEntity.ok("Schema updated successfully!");
        } catch (IOException e) {
            LOGGER.error("Error in updateSchema: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update schema.");
        }
    }

    @DeleteMapping("/delete/{schemaId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteSchemaById(@PathVariable Long schemaId, Authentication authentication) {
        try {
            Optional<Schema> optionalSchema = schemaService.findById(schemaId);
            if (optionalSchema.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Schema not found.");
            }

            Schema schema = optionalSchema.get();

            schema.setDeleteDate(new Date());
            schemaService.save(schema);

            return ResponseEntity.ok("Schema deleted successfully!");
        } catch (Exception e) {
            LOGGER.error("Error in deleteSchema: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete schema.");
        }
    }

    @PutMapping("/restore/{schemaId}/to/{version}")
    public ResponseEntity<String> restoreToVersion(
            @PathVariable Long schemaId,
            @PathVariable Integer version,
    Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            restore(schemaId, version, user);
            return ResponseEntity.ok("Schema restored successfully!");
        } catch (Exception e) {
            LOGGER.error("Error in restoreSchemaToVersion: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to restore schema.");
        }
    }

    public void restore(Long schemaId, Integer version, User user) {
        Schema schema = schemaService.findById(schemaId).orElseThrow();

        Optional<SchemaHistory> optionalSchemaHistory = schemaHistoryService.findBySchemaIdAndVersion(schemaId, version);

        if (optionalSchemaHistory.isEmpty()) {
            throw new RuntimeException();
        }

        SchemaHistory schemaHistory = optionalSchemaHistory.get();
        Integer nextVersion = schema.getVersion() + 1;
        Integer nextVersionToHistory = schema.getHistory().size() + 1;

        SchemaHistory newSchemaHistory = new SchemaHistory();
        newSchemaHistory.setSchema(schema);
        newSchemaHistory.setSourceFile(schema.getSourceFile());
        newSchemaHistory.setVersion(nextVersionToHistory);
        newSchemaHistory.setCreateDate(schema.getCreateDate());
        newSchemaHistory.setUpdateDate(new Date());
        newSchemaHistory.setUser(schema.getUser());

        schema.setSourceFile(schemaHistory.getSourceFile());
        schema.setVersion(nextVersion);
        schema.setBased(schemaHistory.getVersion());
        schema.setUser(user);

        schemaService.save(schema);
        schemaHistoryService.save(newSchemaHistory);
    }

    @GetMapping
    public ResponseEntity<List<SchemaDTO>> getSchemas() {
        try {
            List<Schema> schemas = schemaService.findAll();
            List<SchemaDTO> schemaDTOS = schemas.stream().filter(m -> m.getDeleteDate() == null)
                    .map(this::convertToSchemaDTO).toList();

            return ResponseEntity.ok(schemaDTOS);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private SchemaDTO convertToSchemaDTO(Schema schema) {
        SchemaDTO schemaDTO = new SchemaDTO();
        schemaDTO.setId(schema.getId());
        schemaDTO.setName(schema.getName());
        schemaDTO.setSourceFile(schema.getSourceFile());
        schemaDTO.setCreateDate(schema.getCreateDate());
        schemaDTO.setDeleteDate(schema.getDeleteDate());
        schemaDTO.setUpdateDate(schema.getUpdateDate());
        schemaDTO.setDescription(schema.getDescription());
        schemaDTO.setVersion(schema.getVersion());
        List<HistoryDTO> historyDTOList = schema.getHistory().stream()
                .map(HistoryDTO::convertToHistoryDTO)
                .collect(Collectors.toList());
        schemaDTO.setHistory(historyDTOList);
        schemaDTO.setBased(schema.getBased());
        schemaDTO.setUsername(schema.getUser().getUsername());
        return schemaDTO;
    }
}
