import { IconButton, Theme, Typography } from "@mui/material";
import { Model } from "../../../entities/model";
import {
  History,
  Code,
  Edit,
  Archive,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { FileHistory } from "../../../entities/fileHistory";
import { ModelHistoryPopover } from "./ModelHistory";

interface ModelActionsProps {
  model: Model;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  selectedModel: Model | null;
  handleFavoriteClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleRestore: (model: Model, history: FileHistory) => void;
  handleViewXMLVersion: (model: Model, history: FileHistory) => void;
  handleEdit: (modelId: number) => void;
  handleViewDetails: (modelId: number) => void;
  handleDelete: (modelId: number) => void;
  theme: Theme;
}

export const ModelActions: React.FC<ModelActionsProps> = ({
  model,
  handleClick,
  anchorEl,
  handleClose,
  selectedModel,
  handleFavoriteClick,
  handleViewDetails,
  handleViewXMLVersion,
  handleRestore,
  handleEdit,
  handleDelete,
  theme,
}) => {
  return (
    <>
      <IconButton
        aria-label="history"
        aria-controls={`card-history-${model.id}`}
        aria-haspopup="true"
        onClick={handleClick}
        data-model-id={model.id}
        style={{ borderRadius: 5 }}
      >
        <History />
        <Typography fontSize={14} paddingLeft={1}>
          History
        </Typography>
      </IconButton>

      <ModelHistoryPopover
        model={model}
        anchorEl={anchorEl}
        handleClose={handleClose}
        selectedModel={selectedModel}
        handleRestore={handleRestore}
        handleViewXMLVersion={handleViewXMLVersion}
        theme={theme}
      />

      <IconButton
        style={{ borderRadius: 5 }}
        onClick={() => handleViewDetails(model.id)}
      >
        <Code />
        <Typography fontSize={14} paddingLeft={1}>
          XML File
        </Typography>
      </IconButton>

      <IconButton
        style={{ borderRadius: 5 }}
        onClick={() => handleEdit(model.id)}
      >
        <Edit />
        <Typography fontSize={14} paddingLeft={1}>
          Edit
        </Typography>
      </IconButton>

      <IconButton
        style={{ borderRadius: 5 }}
        onClick={() => handleDelete(model.id)}
      >
        <Archive />
        <Typography fontSize={14} paddingLeft={1}>
          Archive
        </Typography>
      </IconButton>

      <IconButton
        style={{ borderRadius: 5 }}
        aria-label="favorite"
        aria-controls={`card-favorite-${model.id}`}
        aria-haspopup="true"
        data-model-id={model.id}
        onClick={handleFavoriteClick}
      >
        {model.favorite ? (
          <Favorite
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.secondary.main
                  : theme.palette.primary.main,
            }}
          />
        ) : (
          <FavoriteBorder />
        )}
      </IconButton>
    </>
  );
};
