import { InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { ModelTable } from "../../../components/ModelTable";
import ModelStore from "../../../stores/ModelStore";
import LoadingAnimation from "../../../components/LoadingAnimation/LoadingAnimation";
import { Search } from "@mui/icons-material";

const DeletedModels = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getDeletedModels = async () => {
    await ModelStore.getDeletedModels();
    setDataLoaded(true);
  };

  useEffect(() => {
    if (!dataLoaded) getDeletedModels();
  }, [ModelStore.models]);

  return (
    <>
      <Typography
        variant="h4"
        sx={{ marginBottom: 3 }}
        style={{ fontWeight: "bold" }}
      >
        Archived models
      </Typography>

      <TextField
        fullWidth
        id="input-with-icon-textfield"
        value={searchTerm}
        size="small"
        sx={{ marginBottom: 2 }}
        placeholder="Search on archived models"
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
        {dataLoaded && (
          <ModelTable
            models={ModelStore.deletedModels}
            loading={ModelStore.isLoading}
          />
        )}
        {ModelStore.isLoading && (
          <LoadingAnimation text="Loading deleted models" />
        )}
      </Paper>
    </>
  );
};

export default observer(DeletedModels);
