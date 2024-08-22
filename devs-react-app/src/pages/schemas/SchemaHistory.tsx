import {
  Divider,
  IconButton,
  Popover,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
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
import { Schema } from "../../entities/schema";
import { FileHistory } from "../../entities/fileHistory";

interface SchemaHistoryProps {
  schema: Schema | null;
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  handleRestore: (schema: Schema, history: FileHistory) => void;
  handleViewXMLVersion: (schema: Schema, history: FileHistory) => void;
  theme: Theme;
}

export const SchemaHistoryPopover: React.FC<SchemaHistoryProps> = ({
  schema,
  anchorEl,
  handleClose,
  handleRestore,
  handleViewXMLVersion,
  theme,
}) => {
  return (
    <Popover
      id={`card-history-${schema?.id}`}
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl && schema?.id)}
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
              {schema && schema?.history.length > 0 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineOppositeContent display="none" />
            <TimelineContent sx={{ px: 2 }}>
              <div className="d-flex flex-row gap-2 justify-content-between">
                <div className="d-flex flex-column">
                  <Typography fontSize={14}>
                    <b>Version {schema?.version}</b>
                  </Typography>
                  <Typography fontSize={12}>
                    Uploaded by {schema?.username}
                  </Typography>
                  <Typography
                    fontSize={12}
                    variant="subtitle1"
                    color="textSecondary"
                  >
                    Edited{" "}
                    {schema?.updateDate
                      ? moment(schema?.updateDate).fromNow()
                      : moment(schema?.createDate).fromNow()}
                  </Typography>

                  <div>
                    {schema?.based && (
                      <Typography fontSize={10}>
                        Based on version {schema?.based}
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

          {schema?.history
            .filter((h: FileHistory) => h.version !== schema.version)
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
                      <Typography fontSize={12}>
                        Uploaded by {h?.user.username}
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
                      {h.version === schema?.version && (
                        <div>
                          {schema?.based && (
                            <Typography fontSize={10}>
                              Based on version {schema?.based}
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
                      {h.version !== schema?.version && (
                        <>
                          <Tooltip title="Restore version">
                            <IconButton
                              style={{ borderRadius: 5 }}
                              onClick={() => handleRestore(schema, h)}
                            >
                              <Replay />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="XML file">
                            <IconButton
                              style={{ borderRadius: 5 }}
                              onClick={() => handleViewXMLVersion(schema, h)}
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
