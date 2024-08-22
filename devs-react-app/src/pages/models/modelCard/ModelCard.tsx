import moment from "moment";
import { Model } from "../../../entities/model";
import { Card, CardContent, Chip, Theme, Typography } from "@mui/material";
import { ModelDescription } from "./ModelDescription";
import { ModelTags } from "./ModelTags";
import { FileHistory } from "../../../entities/fileHistory";
import { ModelActions } from "./ModelActions";

interface ModelCardProps {
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

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  handleClick,
  anchorEl,
  handleClose,
  selectedModel,
  handleFavoriteClick,
  handleViewDetails,
  handleRestore,
  handleViewXMLVersion,
  handleEdit,
  handleDelete,
  theme,
}) => {
  return (
    <Card
      key={model.id}
      variant="outlined"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div className="d-flex flex-row justify-content-between">
        <CardContent>
          <div className="d-flex flex-row align-items-center gap-2 mb-2">
            <Typography variant="h6">{model.name}</Typography>
            <Chip
              variant="outlined"
              size="small"
              label={"#" + model.id}
              color="primary"
            />
          </div>
          <Typography fontSize={12} variant="subtitle1" color="textSecondary">
            Edited{" "}
            {model.updateDate
              ? moment(model.updateDate).fromNow()
              : moment(model.createDate).fromNow()}
          </Typography>
          <ModelDescription description={model.description} />
          <ModelTags tags={model.tags} />
        </CardContent>
        <div className="d-flex flex-column justify-content-between">
          <div
            style={{
              justifyContent: "end",
              marginTop: 15,
              marginRight: 5,
            }}
          >
            <ModelActions
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
          </div>
          <div className='p-3' style={{marginLeft: 'auto', fontSize: '14px'}}>Uploaded by {model.username}</div>
        </div>

      </div>
    </Card>
  );
};
