import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import {
  Typography,
  Paper,
  useTheme,
  Theme,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import SessionStore from "../../stores/SessionStore";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import ModelStore from "../../stores/ModelStore";
import moment from "moment";
import SchemaStore from "../../stores/SchemaStore";
import TagStore from "../../stores/TagStore";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";

const Dashboard = () => {
  const navigate = useNavigate();
  const [dataLoaded, setDataLoaded] = useState(false);
  const theme = useTheme<Theme>();

  useEffect(() => {
    if (!SessionStore.isLoggedIn) {
      navigate("/login");
    }
  }, [SessionStore.isLoggedIn]);

  const getModels = async () => {
    await ModelStore.getModels();
    setDataLoaded(true);
  };

  const getSchemas = async () => {
    await SchemaStore.getSchemas();
    setDataLoaded(true);
  };

  const getTags = async () => {
    await TagStore.getTags();
    setDataLoaded(true);
  };

  useEffect(() => {
    if (!dataLoaded) {
      getModels();
      getSchemas();
      getTags();
    }
  }, [ModelStore.models, SchemaStore.schemas, TagStore.tags]);

  const loading =
    ModelStore.isLoading || SchemaStore.isLoading || TagStore.isLoading;

  return (
    <>
      <Typography variant="h4" style={{ fontWeight: "bold", marginBottom: 20 }}>
        Dashboard
      </Typography>

      <Paper style={{ padding: 20 }}>
        <Paper
          sx={{
            marginY: 3,
            flex: "row",
            borderRadius: 3,
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
            padding: 2,
          }}
        >
          <Typography>
            <b>Hello</b>, {SessionStore.userSession?.firstName}!
          </Typography>
          <Typography>
            Welcome to your personalized dashboard. <br />
            Here, you can explore insights and information about your recent
            models, simulation results, and more.
          </Typography>
        </Paper>

        {dataLoaded && !loading && (
          <div style={{ display: "flex", gap: 20 }}>
            <Paper
              sx={{
                width: "33%",
                borderRadius: 3,
                padding: 5,
                flexWrap: "wrap",
                border: "1px solid",
                borderColor: theme.palette.primary.light,
              }}
            >
              <Typography variant="h6" className="mb-2">
                <b>Models</b>
              </Typography>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {!!ModelStore.models.length && (
                  <List>
                    {ModelStore.models.map((model) => (
                      <ListItem key={model.id}>
                        <Chip
                          sx={{ marginRight: 2 }}
                          label={"#" + model.id}
                        ></Chip>
                        <ListItemText
                          primary={model.name}
                          secondary={moment(model.createDate).fromNow()}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </div>
              {!ModelStore.models.length && (
                <Typography>No data yet</Typography>
              )}
            </Paper>
            <Paper
              sx={{
                width: "33%",
                borderRadius: 3,
                padding: 5,
                flexWrap: "wrap",
                border: "1px solid",
                borderColor: theme.palette.primary.main,
              }}
            >
              <Typography variant="h6" className="mb-2">
                <b>Schemas</b>
              </Typography>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {!!SchemaStore.schemas.length && (
                  <List>
                    {SchemaStore.schemas.map((schema) => (
                      <ListItem key={schema.id}>
                        <Chip
                          sx={{ marginRight: 2 }}
                          label={"#" + schema.id}
                        ></Chip>
                        <ListItemText
                          primary={schema.name}
                          secondary={moment(schema.createDate).fromNow()}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </div>
              {!SchemaStore.schemas.length && (
                <Typography>No data yet</Typography>
              )}
            </Paper>
            <Paper
              sx={{
                width: "33%",
                borderRadius: 3,
                padding: 5,
                flexWrap: "wrap",
                border: "1px solid",
                borderColor: theme.palette.primary.dark,
              }}
            >
              <Typography variant="h6" className="mb-2">
                <b>Tags</b>
              </Typography>
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {!!TagStore.tags.length && (
                  <List>
                    {TagStore.tags.map((tag) => (
                      <ListItem key={tag.id}>
                        <Chip
                          sx={{ marginRight: 2 }}
                          label={"#" + tag.id}
                        ></Chip>
                        <ListItemText
                          primary={tag.name}
                          secondary={moment(tag.createDate).fromNow()}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </div>
              {!TagStore.tags.length && <Typography>No data yet</Typography>}
            </Paper>
          </div>
        )}

        {loading && (
          <Paper
            sx={{
              width: "100%",
              borderRadius: 3,
              padding: 5,
              flexWrap: "wrap",
              border: "1px solid",
              borderColor: theme.palette.primary.light,
            }}
          >
            <LoadingAnimation text="Loading data" />
          </Paper>
        )}
      </Paper>
    </>
  );
};

export default observer(Dashboard);
