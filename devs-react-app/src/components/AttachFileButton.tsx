import React from "react";
import { Button, Typography } from "@mui/material";
import {
  AttachFile,
  CheckCircle,
  ErrorRounded,
  WarningRounded,
} from "@mui/icons-material";
import { ViewXMLFile } from "./ViewXMLFile";

interface Props {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  validFileExtension: string;
}

const AttachFileButton: React.FC<Props> = ({
  onFileChange,
  file,
  validFileExtension,
}) => {
  const [viewModelOpen, setViewModelOpen] = React.useState(false);
  const [fileExtensionError, setFileExtensionError] = React.useState(false);

  const handleViewDetails = () => {
    if (file) {
      setViewModelOpen(true);
    }
  };

  const handleCancelViewModel = () => {
    setViewModelOpen(false);
  };

  const validateExtension = (fileName: string) => {
    return fileName.toLowerCase().endsWith(validFileExtension);
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (validateExtension(selectedFile.name)) {
        setFileExtensionError(false);
        onFileChange(event);
      } else {
        setFileExtensionError(true);
      }
    }
  };

  return (
    <>
      <ViewXMLFile
        onClose={handleCancelViewModel}
        open={viewModelOpen}
        file={file as File}
      />
      <div
        className="d-flex flex-row align-items-center"
        style={{ justifyContent: "space-between", width: "100%" }}
      >
        <label htmlFor="file-input">
          <Button
            component="span"
            variant="contained"
            startIcon={<AttachFile />}
          >
            {file
              ? "Change file"
              : `Attach ${validFileExtension.split(".").pop()} file`}
          </Button>
        </label>
        <input
          id="file-input"
          type="file"
          style={{ display: "none" }}
          onChange={onFileInputChange}
          accept={validFileExtension}
        />
        {file ? (
          <div className="d-flex flex-row align-items-center">
            <div className="d-flex flex-row">
              <CheckCircle color="success" />
              <Typography sx={{ ml: 1 }}>File uploaded successfully</Typography>
            </div>
            <Button sx={{ ml: 1 }} variant="text" onClick={handleViewDetails}>
              View file
            </Button>
          </div>
        ) : (
          <div className="d-flex flex-row gap-1">
            {fileExtensionError ? (
              <div className="d-flex flex-row">
                <ErrorRounded color="error" />
                <Typography sx={{ ml: 1 }}>Invalid file extension</Typography>
              </div>
            ) : (
              <div className="d-flex flex-row">
                <WarningRounded color="warning" />
                <Typography sx={{ ml: 1 }}>Please select a file</Typography>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AttachFileButton;
