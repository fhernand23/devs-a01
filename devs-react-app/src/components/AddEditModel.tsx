import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
  Select,
  MenuItem,
  Chip,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Model } from "../entities/model";
import { Tag } from "../entities/tag";
import ModelStore from "../stores/ModelStore";
import AttachFileButton from "./AttachFileButton";
import { base64ToFile } from "../utils/file";
import TagStore from "../stores/TagStore";
import { Cancel, Check, Tag as TagIcon } from "@mui/icons-material";
import SchemaStore from "../stores/SchemaStore";
import InfoTooltip from "./InfoTooltip";
import MultipleSelectChip from "./MultipleSelectChip";

interface AddEditModelProps {
  open: boolean;
  onClose: () => void;
  model: Model | null;
}

const AddEditModel: React.FC<AddEditModelProps> = ({
  open,
  onClose,
  model,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [openAddTagDialog, setOpenAddTagDialog] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedValidSchema, setSelectedValidSchema] = useState("");
  const theme = useTheme();

  useEffect(() => {
    TagStore.getTags();
    SchemaStore.getSchemas();
  }, []);

  useEffect(() => {
    if (model) {
      setName(model.name);
      setDescription(model.description);
      setSelectedTags(model.tags.map((t) => t.name));
      setFile(
        base64ToFile(
          model.sourceFile as string,
          `${model.name}_${model.id}.xml`
        )
      );
    } else {
      setName("");
      setSelectedTags([]);
      setFile(null);
      setDescription("");
    }
  }, [model]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }

    formData.append("name", name);
    formData.append("description", description);
    formData.append("tags", selectedTags.toString());
    formData.append("schemaId", selectedValidSchema);

    if (model) {
      const response = await ModelStore.updateModel(formData, model.id);
      if (response) {
        onClose();
        cleanModal();
      } else {
        return;
      }
    } else {
      const response = await ModelStore.uploadModel(formData);
      if (response) {
        onClose();
        cleanModal();
      } else {
        return;
      }
    }
  };

  const cleanModal = () => {
    setName("");
    setSelectedTags([]);
    setFile(null);
    setDescription("");
    setSelectedValidSchema("");
  };

  const handleOpenAddTagDialog = () => {
    setOpenAddTagDialog(true);
  };

  const handleCloseAddTagDialog = () => {
    setOpenAddTagDialog(false);
  };

  const handleAddNewTag = () => {
    handleOpenAddTagDialog();
  };

  const handleConfirmAddTag = () => {
    if (newTagName && !selectedTags.includes(newTagName)) {
      setSelectedTags([...selectedTags, newTagName]);
      setNewTagName("");
      handleCloseAddTagDialog();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{model ? "Edit Model" : "Upload Model"}</DialogTitle>
      <Divider style={{ borderColor: "gray" }} />
      <DialogContent style={{ marginTop: 10 }}>
        <TextField
          label="Name"
          value={name}
          onChange={handleNameChange}
          fullWidth
          style={{ marginBottom: 20 }}
          required
          size="small"
        />
        <TextField
          label="Documentation"
          value={description}
          onChange={handleDescriptionChange}
          fullWidth
          style={{ marginBottom: 10 }}
          required
          multiline
          size="small"
          rows={2}
          maxRows={5}
          inputProps={{ maxLength: 255 }}
        />

        <Dialog open={openAddTagDialog} onClose={handleCloseAddTagDialog}>
          <DialogTitle>Add new tag</DialogTitle>
          <Divider style={{ borderColor: "gray" }} />
          <DialogContent>
            <div className="d-flex flex-row flex-grow-0 gap-5 align-items-center justify-content-between">
              <TextField
                label="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                fullWidth
                sx={{ marginTop: 1 }}
                size="small"
              />

              <div className="flex-grow-1">
                <Button
                  fullWidth
                  onClick={handleConfirmAddTag}
                  variant="contained"
                  color="primary"
                >
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Divider style={{ marginTop: 20, borderColor: "gray" }} />
        {selectedTags.length > 0 || TagStore.tags.length > 0 ? (
          <div>
            <div>
              <Typography fontSize={14} sx={{ marginBottom: 2, marginTop: 2 }}>
                <b>Select tags</b>
              </Typography>
              <div className="d-flex flex-row align-items-center justify-content-between">
                <MultipleSelectChip
                  multiple
                  label={"Tags"}
                  options={TagStore.tags.map((tag) => tag.name)}
                  selected={selectedTags}
                  setSelected={setSelectedTags}
                />

                <Button
                  component="span"
                  variant="contained"
                  startIcon={<TagIcon />}
                  onClick={handleAddNewTag}
                  style={{ borderRadius: 5 }}
                >
                  Add custom tag
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        <Divider
          style={{ marginTop: 20, marginBottom: 20, borderColor: "gray" }}
        />
        <div style={{ marginTop: 20 }}>
          <AttachFileButton
            validFileExtension={".xml"}
            onFileChange={handleFileChange}
            file={file}
          />
        </div>
        {file && (
          <>
            <Divider style={{ marginTop: 20, borderColor: "gray" }} />
            <div className="d-flex flex-row align-items-center">
              <Typography fontSize={14} sx={{ marginBottom: 2, marginTop: 2 }}>
                <b>Select a schema</b>
              </Typography>
              <InfoTooltip
                width={15}
                height={15}
                spacing={1}
                title="DEVS will validate your XML File against the selected XSD schema."
              />
            </div>

            <Select
              style={{ width: "100%" }}
              fullWidth
              size="small"
              value={selectedValidSchema}
              onChange={(e) => {
                setSelectedValidSchema(e.target.value);
                console.log(e.target.value);
              }}
            >
              {SchemaStore.schemas.map((schema) => (
                <MenuItem
                  key={schema.id}
                  value={schema.id}
                  sx={{ justifyContent: "space-between" }}
                >
                  <div className="d-flex flex-row align-items-center">
                    {schema.name}
                    <InfoTooltip
                      title={schema.description}
                      width={15}
                      height={15}
                      spacing={1}
                    />
                  </div>
                </MenuItem>
              ))}
            </Select>
          </>
        )}
      </DialogContent>
      <Divider style={{ borderColor: "gray" }} />

      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            cleanModal();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={name === "" || file === null || selectedValidSchema === ""}
        >
          {model ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditModel;
