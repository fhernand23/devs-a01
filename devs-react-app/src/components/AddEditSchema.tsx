import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
} from "@mui/material";
import { Schema } from "../entities/schema";
import SchemaStore from "../stores/SchemaStore";
import AttachFileButton from "./AttachFileButton";
import { base64ToFile } from "../utils/file";

interface AddEditSchemaProps {
  open: boolean;
  onClose: () => void;
  schema: Schema | null;
}

const AddEditSchema: React.FC<AddEditSchemaProps> = ({
  open,
  onClose,
  schema,
}) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (schema) {
      setName(schema.name);
      setFile(
        base64ToFile(
          schema.sourceFile as string,
          `${schema.name}_${schema.id}.xsd`
        )
      );
      setDescription(schema.description);
    } else {
      setName("");
      setFile(null);
      setDescription("");
    }
  }, [schema]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (file) {
      formData.append("file", file);
    }
    formData.append("description", description);

    if (schema) {
      await SchemaStore.updateSchema(formData, schema.id);
    } else {
      await SchemaStore.uploadSchema(formData);
    }

    onClose();
    cleanModal();
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

  const cleanModal = () => {
    setName("");
    setFile(null);
    setDescription("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{schema ? "Edit schema" : "Upload schema"}</DialogTitle>
      <Divider style={{ borderColor: "gray" }} />
      <DialogContent style={{ marginTop: 10 }}>
        <TextField
          label="Name"
          size="small"
          value={name}
          onChange={handleNameChange}
          fullWidth
          style={{ marginBottom: 20 }}
          required
        />
        <Divider
          style={{ marginBottom: 20, borderColor: "gray" }}
        />
        <TextField
          label="Documentation"
          value={description}
          onChange={handleDescriptionChange}
          fullWidth
          style={{ marginBottom: 20 }}
          required
          multiline
          rows={5}
          size="small"
          maxRows={4}
          inputProps={{ maxLength: 255 }}
        />
        <Divider
          style={{ marginTop: 20, marginBottom: 20, borderColor: "gray" }}
        />
        <div style={{ marginTop: 20 }}>
          <AttachFileButton
            validFileExtension={".xsd"}
            onFileChange={handleFileChange}
            file={file}
          />
        </div>
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
          disabled={!name || !file}
        >
          {schema ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditSchema;
