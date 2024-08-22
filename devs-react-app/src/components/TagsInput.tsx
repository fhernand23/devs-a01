import React, { useState } from "react";
import { Chip, InputAdornment, TextField, Tooltip } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import InfoTooltip from "./InfoTooltip";

export interface Tag {
  id: number;
  name: string;
}

export interface TagsInputProps {
  tags: Tag[];
  onChange: (tags: Tag[]) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setError(null);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      const tagName = inputValue.trim();
      if (
        !tags.some((tag) => tag.name.toLowerCase() === tagName.toLowerCase())
      ) {
        const newTag: Tag = {
          id: tags.length + 1,
          name: tagName,
        };

        onChange([...tags, newTag]);
        setInputValue("");
      } else {
        setError("Tag name must be unique.");
      }
    }
  };

  const handleDelete = (tagToDelete: Tag) => {
    const updatedTags = tags.filter((tag) => tag.id !== tagToDelete.id);
    onChange(updatedTags);
  };

  return (
    <TextField
      label="Tags"
      variant="outlined"
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      style={{ width: "100%" }}
      error={Boolean(error)}
      helperText={error}
      InputProps={{
        startAdornment: tags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            onDelete={() => handleDelete(tag)}
            style={{ margin: 5 }}
          />
        )),
        endAdornment: (
          <InfoTooltip title={"You can add tags by pressing enter"} />
        ),
      }}
    />
  );
};

export default TagsInput;
