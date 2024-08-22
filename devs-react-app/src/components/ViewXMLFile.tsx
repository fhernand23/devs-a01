import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  useTheme,
  Chip,
} from "@mui/material";
import { readFileAsText } from "../utils/file";
import { useEffect, useState } from "react";
import { Download, GraphicEq } from "@mui/icons-material";
import XMLViewer from "react-xml-viewer";
import { FileHistory } from "../entities/fileHistory";
import { VersionableFile } from "../entities/versionableFile";

export interface ViewXMLFileProps {
  open: boolean;
  onClose: () => void;
  file: File;
  model?: VersionableFile | null;
  history?: FileHistory | null;
}

export const ViewXMLFile: React.FC<ViewXMLFileProps> = ({
  open,
  onClose,
  file,
  model,
  history,
}) => {
  const [xml, setXml] = useState("");
  const [generateGraph, setGenerateGraph] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (file) {
      readFileText();
    }
  }, [file]);

  const readFileText = async () => {
    if (file) {
      await readFileAsText(file).then((xml) => setXml(xml));
    }
  };

  const customTheme = {
    attributeKeyColor:
      theme.palette.mode === "dark"
        ? theme.palette.secondary.main
        : theme.palette.primary.main,
    attributeValueColor:
      theme.palette.mode === "dark"
        ? theme.palette.secondary.light
        : theme.palette.secondary.dark,
    cdataColor: theme.palette.mode === "dark" ? "#FF00FF" : "#800080",
    commentColor: theme.palette.mode === "dark" ? "#808080" : "#808080",
    fontFamily:
      theme.palette.mode === "dark"
        ? "Consolas, monospace"
        : "Consolas, monospace",
    separatorColor: theme.palette.mode === "dark" ? "#808080" : "#808080",
    tagColor:
      theme.palette.mode === "dark"
        ? theme.palette.secondary.main
        : theme.palette.primary.main,
    textColor: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={onClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          <div
            style={{
              display: "flex",
              flex: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              {model && (
                <>
                  <Typography>
                    <b>{model.name}</b>
                  </Typography>
                  <Typography
                    fontSize={12}
                    variant="subtitle1"
                    color="textSecondary"
                  >
                    {`Version ${history ? history?.version : model.version}`}
                  </Typography>
                </>
              )}
            </div>

            {file && (
              <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                <div>
                  {" "}
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ textDecoration: "none" }}
                    onClick={() => setGenerateGraph(true)}
                    startIcon={<GraphicEq />}
                  >
                    Generate graph
                    <Chip sx={{ marginLeft: 1 }} label="BETA" />
                  </Button>
                </div>

                <Button
                  variant="outlined"
                  color="primary"
                  href={URL.createObjectURL(file)}
                  download={`${file.name}`}
                  style={{ textDecoration: "none" }}
                  startIcon={<Download />}
                >
                  Download file
                </Button>
              </div>
            )}
          </div>
        </DialogTitle>
        <DialogContent>
          <div>
            <XMLViewer
              indentSize={2}
              xml={xml}
              collapsible={true}
              theme={customTheme}
              invalidXml={
                <Typography color={"error"}>
                  {" "}
                  Could not read the XML correctly, please check the uploaded
                  file.
                </Typography>
              }
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
