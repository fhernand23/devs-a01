import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Code,
  CodeSharp,
  Create,
  DeleteForever,
  FileDownload,
  History,
  Search,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import SchemaStore from "../../stores/SchemaStore";
import moment from "moment";
import { base64ToFile } from "../../utils/file";
import AddEditSchema from "../../components/AddEditSchema";
import { Schema } from "../../entities/schema";
import { SchemaHistoryPopover } from "./SchemaHistory";
import { FileHistory } from "../../entities/fileHistory";
import { ViewXMLFile } from "../../components/ViewXMLFile";

export const SchemasTable = () => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedSchema, setSelectedSchema] = React.useState<Schema | null>(
    null
  );
  const [selectedHistory, setSelectedHistory] =
    React.useState<FileHistory | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [viewFile, setViewFile] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = React.useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filteredSchemas, setFilteredSchemas] = useState<Schema[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getSchemas = async () => {
    const schemas = await SchemaStore.getSchemas();
    setFilteredSchemas(schemas);
    setDataLoaded(true);
  };

  useEffect(() => {
    if (!dataLoaded) getSchemas();
  }, [dataLoaded]);

  const filterSchemas = (schemas: Schema[], searchTerm: string) => {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    return schemas.filter((schema) => {
      const normalizedName = schema.name.toLowerCase();
      const normalizedDescription = schema.description?.toLowerCase();

      return (
        normalizedName.includes(normalizedSearchTerm) ||
        normalizedDescription?.includes(normalizedSearchTerm)
      );
    });
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredSchemas(SchemaStore.schemas);
    }
    const filteredSchemas = filterSchemas(SchemaStore.schemas, searchTerm);
    setFilteredSchemas(filteredSchemas);
  }, [searchTerm, SchemaStore.schemas]);

  const handleClick = (schemaId: number) => {
    const schemaFinded = SchemaStore.schemas.find(
      (schema) => schema.id === schemaId
    );
    if (schemaFinded) setSelectedSchema(schemaFinded);
  };

  const findSchemaAndFile = (schemaId: number) => {
    const findedSchema = SchemaStore.schemas.find(
      (schema) => schema.id === schemaId
    );
    setSelectedSchema(findedSchema || null);
    setFile(
      base64ToFile(
        findedSchema?.sourceFile as string,
        `${findedSchema?.name}_${findedSchema?.id}.xsd`
      )
    );
  };

  const handleDelete = (schemaId: number) => {
    handleClick(schemaId);
    setDeleteDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setDialogOpen(false);
    setSelectedSchema(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedSchema(null);
    setSelectedHistory(null);
  };

  const handleViewHistory = (
    schemaId: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
    handleClick(schemaId);
  };

  const handleRestore = (schema: Schema, history: FileHistory) => {
    setSelectedSchema(schema);
    setSelectedHistory(history);
    setRestoreDialogOpen(true);
  };

  const handleViewDetails = (schemaId: number) => {
    findSchemaAndFile(schemaId);
    setViewFile(true);
  };

  const handleViewXMLVersion = (schema: Schema, history: FileHistory) => {
    setSelectedSchema(schema);
    setFile(
      base64ToFile(
        history?.sourceFile as string,
        `${schema?.name}_${schema?.id}_${`version ${history.version}`}.xsd`
      )
    );
    setViewFile(true);
  };

  const handleCancelViewModel = () => {
    setViewFile(false);
    handleClose();
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleCancelRestore = () => {
    setRestoreDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedSchema) {
      await SchemaStore.deleteSchema(selectedSchema?.id as number);
    }
    setDeleteDialogOpen(false);
    handleClose();
  };

  const handleConfirmRestore = async () => {
    if (selectedSchema && selectedHistory) {
      await SchemaStore.restoreSchema(
        selectedSchema.id as number,
        selectedHistory.version as number
      );
    }
    setRestoreDialogOpen(false);
    handleClose();
  };

  return (
    <>
      <div className="d-flex flex-col justify-content-between align-items-center h-50 mb-3">
        <div className="d-flex flex-row gap-3">
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            Schemas
          </Typography>
          <Button
            sx={{ height: "100%", width: "25ch" }}
            variant="outlined"
            startIcon={<Code />}
            onClick={() => setDialogOpen(true)}
            color={theme.palette.mode === "dark" ? "secondary" : "primary"}
          >
            Add new schema
          </Button>
        </div>
      </div>

      <TextField
        fullWidth
        id="input-with-icon-textfield"
        value={searchTerm}
        size="small"
        sx={{ marginBottom: 2 }}
        placeholder="Search on schemas"
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Paper style={{ padding: 20 }}>
        {dataLoaded && !!filteredSchemas.length && (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Updated</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SchemaStore.schemas.map((schema) => {
                    const file = base64ToFile(
                      schema.sourceFile as string,
                      `${schema.name}_${schema.id}.xsd`
                    );
                    return (
                      <TableRow key={schema.id}>
                        <TableCell>{schema.id}</TableCell>
                        <TableCell>{schema.name}</TableCell>
                        <TableCell>{schema.description}</TableCell>
                        <TableCell>
                          {moment(schema.createDate).fromNow()}
                        </TableCell>
                        <TableCell>
                          {schema.updateDate
                            ? moment(schema.updateDate).fromNow()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="large"
                            edge="start"
                            sx={{ mr: 2 }}
                            onClick={() => {
                              handleClick(schema.id);
                              setDialogOpen(true);
                            }}
                          >
                            <Create />
                          </IconButton>
                          <IconButton
                            size="large"
                            edge="start"
                            sx={{ mr: 2 }}
                            onClick={() => handleDelete(schema.id)}
                          >
                            <DeleteForever />
                          </IconButton>
                          <IconButton
                            size="large"
                            edge="start"
                            sx={{ mr: 2 }}
                            onClick={(e) => handleViewHistory(schema.id, e)}
                          >
                            <History />
                          </IconButton>
                          <IconButton
                            size="large"
                            edge="start"
                            sx={{ mr: 2 }}
                            onClick={(e) => handleViewDetails(schema.id)}
                          >
                            <CodeSharp />
                          </IconButton>
                          <IconButton
                            size="large"
                            edge="start"
                            sx={{ mr: 2 }}
                            href={URL.createObjectURL(file)}
                            download={`${schema.name}.xsd`}
                          >
                            <FileDownload />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        {!filteredSchemas.length && !SchemaStore.isLoading && (
          <Typography sx={{ textAlign: "center" }}>
            {" "}
            No schemas found{" "}
          </Typography>
        )}
        {SchemaStore.isLoading && <LoadingAnimation text="Loading schemas" />}
      </Paper>

      {file && (
        <ViewXMLFile
          onClose={handleCancelViewModel}
          open={viewFile}
          file={file}
          model={selectedSchema}
          history={selectedHistory}
        />
      )}

      <Dialog
        open={restoreDialogOpen || deleteDialogOpen}
        onClose={restoreDialogOpen ? handleCancelRestore : handleCancelDelete}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          {restoreDialogOpen
            ? `Restore ${selectedSchema?.name} to version ${selectedHistory?.version}`
            : `Archive ${selectedSchema?.name}`}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" id="confirm-dialog-description">
            {restoreDialogOpen
              ? "Are you sure you want to restore this schema?"
              : "Are you sure you want to archive the selected schema?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={
              restoreDialogOpen ? handleCancelRestore : handleCancelDelete
            }
          >
            Cancel
          </Button>
          <Button
            onClick={
              restoreDialogOpen ? handleConfirmRestore : handleConfirmDelete
            }
          >
            {restoreDialogOpen ? "Restore" : "Archive"}
          </Button>
        </DialogActions>
      </Dialog>

      <SchemaHistoryPopover
        schema={selectedSchema}
        anchorEl={anchorEl}
        handleClose={handleClose}
        handleRestore={handleRestore}
        handleViewXMLVersion={handleViewXMLVersion}
        theme={theme}
      />

      <AddEditSchema
        open={dialogOpen}
        onClose={handleCloseEdit}
        schema={selectedSchema}
      />
    </>
  );
};
