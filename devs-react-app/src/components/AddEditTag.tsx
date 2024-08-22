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
import { Tag } from "./TagsInput";
import TagStore from "../stores/TagStore";

interface AddEditTagProps {
  open: boolean;
  onClose: () => void;
  tag: Tag | null;
}

const AddEditTag: React.FC<AddEditTagProps> = ({ open, onClose, tag }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (tag) {
      setName(tag.name);
    } else {
      setName("");
    }
  }, [tag]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);

    if (tag) {
      await TagStore.updateTag(formData, tag.id);
    } else {
      await TagStore.uploadTag(formData);
    }

    onClose();
    cleanModal();
  };

  const cleanModal = () => {
    setName("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{tag ? "Edit Tag" : "Upload Tag"}</DialogTitle>
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
        <Button onClick={handleSubmit} color="primary" disabled={name === ""}>
          {tag ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditTag;
