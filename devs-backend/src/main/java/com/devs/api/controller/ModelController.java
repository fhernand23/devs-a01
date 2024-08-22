package com.devs.api.controller;

import com.devs.api.dto.HistoryDTO;
import com.devs.api.dto.ModelDTO;
import com.devs.api.entity.*;
import com.devs.api.service.ModelHistoryService;
import com.devs.api.service.ModelService;
import com.devs.api.service.SchemaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.devs.api.validation.XMLValidation.getXMLErrorMessage;
import static com.devs.api.validation.XMLValidation.validateXMLSchema;

@RestController
@RequestMapping("/api/models")
public class ModelController {
    private final ModelService modelService;
    private final ModelHistoryService modelHistoryService;
    private final SchemaService schemaService;
    private static final Logger LOGGER = LoggerFactory.getLogger(ModelController.class);

    public ModelController(ModelService modelService, ModelHistoryService modelHistoryService, SchemaService schemaService) {
        this.modelService = modelService;
        this.modelHistoryService = modelHistoryService;
        this.schemaService = schemaService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadModel(@RequestParam("file") MultipartFile file,
                                              @RequestParam("name") String name,
                                              @RequestParam("description") String description,
                                              @RequestParam("tags") List<String> tags,
                                              @RequestParam("schemaId") String schemaId,
                                              Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Model model = new Model();
            model.setName(name);
            model.setDescription(description);

            List<Tag> modelTags = modelService.createOrUpdateTags(tags, user.getId());
            model.setTags(modelTags);

            model.setCreateDate(new Date());
            model.setUser(user);
            model.setVersion(1);

            byte[] xsdSchema = getSchema(schemaId);
            byte[] xmlSchema = file.getBytes();

            boolean isXMLValid = validateXMLSchema(xsdSchema, xmlSchema);

            if (!isXMLValid) {
                String errorMessage = "XML is not valid according to the XSD. Error: " + getXMLErrorMessage();
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
            }

            model.setSourceFile(xmlSchema);

            modelService.save(model);

            return ResponseEntity.ok("Model uploaded successfully!");
        } catch (IOException e) {
            LOGGER.error("Error in uploadModel: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload model.");
        }
    }

    @PutMapping("/update/{modelId}")
    public ResponseEntity<String> updateModel(@PathVariable("modelId") Long modelId,
                                              @RequestParam(value = "file", required = false)
                                              MultipartFile file,
                                              @RequestParam(value = "name", required = false)
                                              String name,
                                              @RequestParam(value = "tags", required = false)
                                              List<String> tags,
                                              @RequestParam(value = "description", required = false)
                                              String description,
                                              @RequestParam("schemaId") String schemaId,
                                              Authentication authentication) {
        try {
            Optional<Model> optionalModel = modelService.findById(modelId);
            if (optionalModel.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Model not found.");
            }

            Model existingModel = optionalModel.get();

            User user = (User) authentication.getPrincipal();
            Long userId = user.getId();

            checkOwner(authentication, existingModel);

            if (name != null) {
                existingModel.setName(name);
            }

            if (description != null) {
                existingModel.setDescription(description);
            }

            if (tags != null) {
                List<Tag> modelTags = modelService.createOrUpdateTags(tags, userId);
                existingModel.setTags(modelTags);
            }

            if (file != null && !file.isEmpty()) {

                byte[] xsdSchema = getSchema(schemaId);
                byte[] xmlSchema = file.getBytes();

                boolean isXMLValid = validateXMLSchema(xsdSchema, xmlSchema);

                if (!isXMLValid) {
                    String errorMessage = "XML is not valid according to the XSD. Error: " + getXMLErrorMessage();
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
                }

                if (!Arrays.equals(xmlSchema, existingModel.getSourceFile())) {

                    // Update model history
                    ModelHistory modelHistory = new ModelHistory();
                    modelHistory.setModel(existingModel);
                    modelHistory.setSourceFile(existingModel.getSourceFile());
                    modelHistory.setVersion(existingModel.getVersion());
                    modelHistory.setCreateDate(existingModel.getCreateDate());
                    modelHistory.setUpdateDate(new Date());
                    modelHistory.setUser(existingModel.getUser());
                    modelHistoryService.save(modelHistory);

                    // Update current model
                    existingModel.setSourceFile(xmlSchema);
                    existingModel.setVersion(existingModel.getVersion() + 1);
                    existingModel.setUser(user);
                }
            }

            existingModel.setUpdateDate(new Date());
            modelService.save(existingModel);

            return ResponseEntity.ok("Model updated successfully!");
        } catch (IOException e) {
            LOGGER.error("Error in updateModel: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update model.");
        }
    }

    @DeleteMapping("/delete/{modelId}")
    public ResponseEntity<String> deleteModelById(@PathVariable Long modelId, Authentication authentication) {
        try {
            Optional<Model> optionalModel = modelService.findById(modelId);
            if (optionalModel.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Model not found.");
            }

            Model model = optionalModel.get();

            checkOwner(authentication, model);

            model.setDeleteDate(new Date());
            modelService.save(model);

            return ResponseEntity.ok("Model deleted successfully!");
        } catch (Exception e) {
            LOGGER.error("Error in deleteModelById: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete model.");
        }
    }

    @PutMapping("/restoreFromTrash/{modelId}")
    public ResponseEntity<String> restoreModelFromTrash(@PathVariable Long modelId, Authentication authentication) {
        try {
            Optional<Model> optionalModel = modelService.findById(modelId);
            if (optionalModel.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Model not found.");
            }

            Model model = optionalModel.get();

            checkOwner(authentication, model);

            model.setDeleteDate(null);
            modelService.save(model);

            return ResponseEntity.ok("Model restored successfully!");
        } catch (Exception e) {
            LOGGER.error("Error in restoreModelFromTrash: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to restore model.");
        }
    }

    @GetMapping
    public ResponseEntity<List<ModelDTO>> getModels(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long userId = user.getId();

            List<Model> models = modelService.getModelsByUserId(userId);
            List<ModelDTO> modelDTOs = models.stream().filter(m -> m.getDeleteDate() == null)
                    .map(this::convertToModelDTO).toList();

            return ResponseEntity.ok(modelDTOs);
        } catch (Exception e) {
            LOGGER.error("Error in getModels: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/deleted")
    public ResponseEntity<List<ModelDTO>> getDeletedModels(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            Long userId = user.getId();

            List<Model> models = modelService.getModelsByUserId(userId);
            List<ModelDTO> modelDTOs = models.stream().filter(m -> m.getDeleteDate() != null)
                    .map(this::convertToModelDTO).toList();

            return ResponseEntity.ok(modelDTOs);
        } catch (Exception e) {
            LOGGER.error("Error in getDeletedModels: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{modelId}")
    public ResponseEntity<ModelDTO> getModelById(@PathVariable Long modelId, Authentication authentication) {
        try {
            Optional<Model> optionalModel = modelService.findById(modelId);
            if (optionalModel.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            Model model = optionalModel.get();
            checkOwner(authentication, model);
            ModelDTO modelDTO = convertToModelDTO(model);

            LOGGER.info("Model listed successfully");
            return ResponseEntity.ok(modelDTO);
        } catch (Exception e) {
            LOGGER.error("Error in getModelById: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/favorite/{modelId}")
    public ResponseEntity<String> setModelAsFavorite(@PathVariable Long modelId, Authentication authentication) {
        try {
            Optional<Model> optionalModel = modelService.findById(modelId);
            if (optionalModel.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Model not found.");
            }

            Model model = optionalModel.get();
            checkOwner(authentication, model);

            if (model.getFavorite() != null) {
                model.setFavorite(!model.getFavorite());
            } else {
                model.setFavorite(true);
            }

            model.setUpdateDate(new Date());
            modelService.save(model);

            return ResponseEntity.ok("Model set as favorite!");
        } catch (Exception e) {
            LOGGER.error("Error in setModelAsFavorite: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to set model as favorite.");
        }
    }

    @PutMapping("/restore/{modelId}/to/{version}")
    public ResponseEntity<String> restoreToVersion(
            @PathVariable Long modelId,
            @PathVariable Integer version,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();;
            restore(modelId, version, user);
            return ResponseEntity.ok("Model restored successfully!");
        } catch (Exception e) {
            LOGGER.error("Error in restoreModelToVersion: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to restore model.");
        }
    }

    public void restore(Long modelId, Integer version, User user) {
        Model model = modelService.findById(modelId).orElseThrow();

        Optional<ModelHistory> optionalModelHistory = modelHistoryService.findByModelIdAndVersion(modelId, version);

        if (optionalModelHistory.isEmpty()) {
            throw new RuntimeException();
        }

        ModelHistory modelHistory = optionalModelHistory.get();
        Integer nextVersion = model.getVersion() + 1;
        Integer nextVersionToHistory = model.getHistory().size() + 1;

        ModelHistory newModelHistory = new ModelHistory();

        newModelHistory.setModel(model);
        newModelHistory.setSourceFile(model.getSourceFile());
        newModelHistory.setVersion(nextVersionToHistory);
        newModelHistory.setCreateDate(model.getCreateDate());
        newModelHistory.setUpdateDate(new Date());
        newModelHistory.setUser(model.getUser());

        model.setSourceFile(modelHistory.getSourceFile());
        model.setVersion(nextVersion);
        model.setBased(modelHistory.getVersion());
        model.setUser(user);


        modelService.save(model);
        modelHistoryService.save(newModelHistory);
    }

    private void checkOwner(Authentication authentication, Model model) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        if (!model.getUser().getId().equals(userId)) {
            ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    public byte[] getSchema(String schemaId) {
        Optional<Schema> optionalSchema = schemaService.findById(Long.valueOf(schemaId));

        if (optionalSchema.isEmpty()) {
            return null;
        }

        Schema existingSchema = optionalSchema.get();
        byte[] xsdSchema = existingSchema.getSourceFile();

        return xsdSchema;
    }

    private ModelDTO convertToModelDTO(Model model) {
        ModelDTO modelDTO = new ModelDTO();
        modelDTO.setId(model.getId());
        modelDTO.setName(model.getName());
        modelDTO.setSourceFile(model.getSourceFile());
        modelDTO.setTags(model.getTags());
        modelDTO.setVersion(model.getVersion());
        modelDTO.setCreateDate(model.getCreateDate());
        modelDTO.setDeleteDate(model.getDeleteDate());
        modelDTO.setUpdateDate(model.getUpdateDate());
        modelDTO.setFavorite(model.getFavorite());
        List<HistoryDTO> historyDTOList = model.getHistory().stream()
                .map(HistoryDTO::convertToHistoryDTO)
                .collect(Collectors.toList());
        modelDTO.setHistory(historyDTOList);
        modelDTO.setDescription(model.getDescription());
        modelDTO.setBased(model.getBased());
        modelDTO.setUsername(model.getUser().getUsername());
        return modelDTO;
    }
}
