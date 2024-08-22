import {
  Divider,
  IconButton,
  Popover,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { Model } from "../../../entities/model";
import { FileHistory } from "../../../entities/fileHistory";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import moment from "moment";
import { Code, Replay } from "@mui/icons-material";

interface ModelHistoryProps {
  model: Model;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  selectedModel: Model | null;
  handleRestore: (model: Model, history: FileHistory) => void;
  handleViewXMLVersion: (model: Model, history: FileHistory) => void;
  theme: Theme;
}

export const ModelHistoryPopover: React.FC<ModelHistoryProps> = ({
  model,
  anchorEl,
  handleClose,
  selectedModel,
  handleRestore,
  handleViewXMLVersion,
  theme,
}) => {
  return (
    <Popover
      id={`card-history-${model?.id}`}
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl && selectedModel?.id === model?.id)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <div style={{ maxHeight: "250px", overflowY: "auto" }}>
        <Timeline>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color={"secondary"} />
              {model && model?.history.length > 0 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineOppositeContent display="none" />
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <div className="d-flex flex-row gap-3 justify-content-between">
                <div className="d-flex flex-column">
                  <Typography fontSize={14}>
                    <b>Version {model.version}</b>
                  </Typography>
                  <Typography
                    fontSize={12}
                    variant="subtitle1"
                    color="textSecondary"
                  >
                    Edited{" "}
                    {model?.updateDate
                      ? moment(model?.updateDate).fromNow()
                      : moment(model?.createDate).fromNow()}
                  </Typography>

                  <div>
                    {model?.based && (
                      <Typography fontSize={10}>
                        Based on version {model?.based}
                      </Typography>
                    )}
                    <Typography
                      color={
                        theme.palette.mode === "dark"
                          ? theme.palette.secondary.main
                          : theme.palette.primary.main
                      }
                      fontSize={10}
                    >
                      Current version
                    </Typography>
                  </div>
                </div>
              </div>
            </TimelineContent>
          </TimelineItem>

          {model?.history
            .filter((h: FileHistory) => h.version !== model.version)
            .sort((a, b) => b.version - a.version)
            .map((h: FileHistory, index: number, array: FileHistory[]) => (
              <TimelineItem key={h.id}>
                <TimelineSeparator>
                  <TimelineDot color={"grey"} />
                  {index < array.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineOppositeContent display="none" />
                <TimelineContent sx={{ py: "12px", px: 2 }}>
                  <div className="d-flex flex-row gap-3 justify-content-between">
                    <div className="d-flex flex-column">
                      <Typography fontSize={14}>
                        <b>Version {h.version}</b>
                      </Typography>
                      <Typography
                        fontSize={12}
                        variant="subtitle1"
                        color="textSecondary"
                      >
                        Edited{" "}
                        {h.updateDate
                          ? moment(h.updateDate).fromNow()
                          : moment(h.createDate).fromNow()}
                      </Typography>
                      {h.version === model?.version && (
                        <div>
                          {model?.based && (
                            <Typography fontSize={10}>
                              Based on version {model?.based}
                            </Typography>
                          )}
                          <Typography
                            color={
                              theme.palette.mode === "dark"
                                ? theme.palette.secondary.main
                                : theme.palette.primary.main
                            }
                            fontSize={10}
                          >
                            Current version
                          </Typography>
                        </div>
                      )}
                    </div>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <div className="d-flex flex-row gap-2 justify-content-end ">
                      {h.version !== model?.version && (
                        <>
                          <Tooltip title="Restore version">
                            <IconButton
                              style={{ borderRadius: 5 }}
                              onClick={() => handleRestore(model, h)}
                            >
                              <Replay />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="XML file">
                            <IconButton
                              style={{ borderRadius: 5 }}
                              onClick={() => handleViewXMLVersion(model, h)}
                            >
                              <Code />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </div>
                </TimelineContent>
              </TimelineItem>
            ))}
        </Timeline>
      </div>
    </Popover>
  );
};
