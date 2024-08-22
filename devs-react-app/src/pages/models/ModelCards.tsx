import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  TextField,
  InputAdornment,
  useTheme,
  Theme,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Model } from "../../entities/model";
import { base64ToFile } from "../../utils/file";
import {
  AddCircleOutline,
  FavoriteBorder,
  FavoriteOutlined,
  Search,
} from "@mui/icons-material";
import { ViewXMLFile } from "../../components/ViewXMLFile";
import ModelStore from "../../stores/ModelStore";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import AddEditModel from "../../components/AddEditModel";
import { FileHistory } from "../../entities/fileHistory";
import { ModelCard } from "./modelCard/ModelCard";
import MultipleSelectChip from "../../components/MultipleSelectChip";
import TagStore from "../../stores/TagStore";

export const ModelCards = () => {
  const theme = useTheme<Theme>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<FileHistory | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewModelOpen, setViewModelOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAndSortedModels, setFilteredAndSortedModels] = useState<
    Model[]
  >([]);

  const getModels = async () => {
    const models = await ModelStore.getModels();
    setFilteredAndSortedModels(models);
    setDataLoaded(true);
  };

  useEffect(() => {
    if (!dataLoaded) getModels();
  }, [dataLoaded]);

  const filterModels = (
    models: Model[],
    searchTerm: string,
    favoriteOnly: boolean,
    selectedTags: string[]
  ) => {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    return models.filter((model) => {
      const normalizedModelName = model.name.toLowerCase();
      const normalizedDescription = model.description.toLowerCase();
      const normalizedUsername = model.username.toLowerCase();
      const favorite = favoriteOnly ? model.favorite : true;
      const tags =
        selectedTags.length > 0
          ? model.tags.some((tag) => tag.name === selectedTags[0])
          : true;

      return (
        (normalizedModelName.includes(normalizedSearchTerm) ||
          normalizedDescription.includes(normalizedSearchTerm) ||
          normalizedUsername.includes(normalizedSearchTerm)) &&
        favorite &&
        tags
      );
    });
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredAndSortedModels(ModelStore.models);
    }
    const filteredModels = filterModels(
      ModelStore.models,
      searchTerm,
      favoriteOnly,
      selectedTags
    );
    setFilteredAndSortedModels(filteredModels);
  }, [searchTerm, selectedTags, favoriteOnly, ModelStore.models]);

  const handleFavoriteClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const modelId = event.currentTarget.getAttribute("data-model-id");
    await ModelStore.markAsFavorite(parseInt(modelId as string));
    setDataLoaded(false);
  };

  const findModelAndFile = (modelId: number) => {
    const modelFinded = ModelStore.models.find((model) => model.id === modelId);
    setSelectedModel(modelFinded || null);
    setFile(
      base64ToFile(
        modelFinded?.sourceFile as string,
        `${modelFinded?.name}_${modelFinded?.id}.xml`
      )
    );
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    const modelId = event.currentTarget.getAttribute("data-model-id");
    findModelAndFile(Number(modelId));
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedModel(null);
    setSelectedHistory(null);
  };

  const handleDelete = (modelId: number) => {
    findModelAndFile(modelId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedModel) {
      await ModelStore.deleteModel(selectedModel?.id as number);
    }
    setDeleteDialogOpen(false);
    handleClose();
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleRestore = (model: Model, history: FileHistory) => {
    setSelectedModel(model);
    setSelectedHistory(history);
    setRestoreDialogOpen(true);
  };

  const handleConfirmRestore = async () => {
    if (selectedModel && selectedHistory) {
      await ModelStore.restoreModel(
        selectedModel.id as number,
        selectedHistory.version as number
      );
    }
    setRestoreDialogOpen(false);
    handleClose();
  };

  const handleCancelRestore = () => {
    setRestoreDialogOpen(false);
  };

  const handleEdit = (modelId: number) => {
    findModelAndFile(modelId);
    setDialogOpen(true);
  };

  const handleCancelViewModel = () => {
    setViewModelOpen(false);
    handleClose();
  };

  const handleViewDetails = (modelId: number) => {
    findModelAndFile(modelId);
    setViewModelOpen(true);
  };

  const handleViewXMLVersion = (model: Model, history: FileHistory) => {
    setSelectedModel(model);
    setSelectedHistory(history);
    setFile(
      base64ToFile(
        history?.sourceFile as string,
        `${model?.name}_${model?.id}_${`version ${history.version}`}.xml`
      )
    );
    setViewModelOpen(true);
  };

  const handleCloseEdit = () => {
    setDialogOpen(false);
    handleClose();
  };

  return (
    <>
      <div className="d-flex flex-col justify-content-between align-items-center h-50 mb-3">
        <div className="d-flex flex-row gap-3">
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            Models
          </Typography>
          <Button
            sx={{ height: "100%", width: "25ch" }}
            variant="outlined"
            startIcon={<AddCircleOutline />}
            onClick={() => setDialogOpen(true)}
            color={theme.palette.mode === "dark" ? "secondary" : "primary"}
          >
            Add new model
          </Button>
        </div>

        <div className="d-flex flex-row align-items-center gap-3">
          <MultipleSelectChip
            multiple={false}
            label={"Filter by tags"}
            options={TagStore.tags.map((tag) => tag.name)}
            selected={selectedTags}
            setSelected={setSelectedTags}
          />

          <div className="d-flex flex-column gap-1">
            <FormControlLabel
              control={
                <Checkbox
                  color={
                    theme.palette.mode === "dark" ? "secondary" : "primary"
                  }
                  icon={<FavoriteBorder />}
                  checkedIcon={<FavoriteOutlined />}
                  onChange={() => setFavoriteOnly(!favoriteOnly)}
                />
              }
              label="Filter favorites"
              sx={{ fontSize: 14 }}
            />
          </div>
        </div>
      </div>

      <TextField
        fullWidth
        id="input-with-icon-textfield"
        value={searchTerm}
        size="small"
        placeholder="Search on models"
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Paper style={{ padding: 20, marginTop: 10, gap: 20, flexWrap: "wrap" }}>
        {dataLoaded && (
          <div className="d-flex flex-column" style={{ gap: 20 }}>
            {filteredAndSortedModels.map((model) => {
              return (
                <ModelCard
                  model={model}
                  handleClick={handleClick}
                  anchorEl={anchorEl}
                  handleClose={handleClose}
                  selectedModel={selectedModel}
                  handleFavoriteClick={handleFavoriteClick}
                  handleRestore={handleRestore}
                  handleEdit={handleEdit}
                  handleViewDetails={handleViewDetails}
                  handleViewXMLVersion={handleViewXMLVersion}
                  handleDelete={handleDelete}
                  theme={theme}
                />
              );
            })}
            {!filteredAndSortedModels.length && !ModelStore.isLoading && (
              <Typography sx={{ textAlign: "center" }}>
                {" "}
                No models found{" "}
              </Typography>
            )}
          </div>
        )}

        {ModelStore.isLoading && <LoadingAnimation text="Loading models" />}

        <AddEditModel
          open={dialogOpen}
          onClose={handleCloseEdit}
          model={selectedModel}
        />

        {file && (
          <ViewXMLFile
            onClose={handleCancelViewModel}
            open={viewModelOpen}
            file={file}
            model={selectedModel}
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
              ? `Restore ${selectedModel?.name} to version ${selectedHistory?.version}`
              : `Archive ${selectedModel?.name}`}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" id="confirm-dialog-description">
              {restoreDialogOpen
                ? "Are you sure you want to restore this model?"
                : "Are you sure you want to archive the selected model?"}
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
      </Paper>
    </>
  );
};
