import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Typography,
} from "@mui/material";
import { base64ToFile } from "../utils/file";
import moment from "moment";
import { Download, RestoreFromTrash } from "@mui/icons-material";
import { Model } from "../entities/model";
import ModelStore from "../stores/ModelStore";

interface ModelTableProps {
  models: Model[] | [];
  loading: boolean;
}

export const ModelTable: React.FC<ModelTableProps> = ({ models, loading }) => {
  if (!models.length && !loading)
    return (
      <Typography sx={{ textAlign: "center" }}> No models found </Typography>
    );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Deleted</TableCell>
            <TableCell>File</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {models.map((model) => {
            const file = base64ToFile(
              model.sourceFile as string,
              `${model.name}_${model.id}.xml`
            );
            return (
              <TableRow key={model.id}>
                <TableCell>{model.id}</TableCell>
                <TableCell>{model.name}</TableCell>
                <TableCell>
                  {model.tags.length > 0
                    ? model.tags.map((tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          style={{ marginRight: 10 }}
                        />
                      ))
                    : "-"}
                </TableCell>
                <TableCell>{model.version}</TableCell>
                <TableCell>{moment(model.createDate).fromNow()}</TableCell>
                <TableCell>{moment(model.deleteDate).fromNow()}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    href={URL.createObjectURL(file)}
                    download={`${model.name}.xml`}
                    style={{ textDecoration: "none" }}
                    startIcon={<Download />}
                  >
                    {`${model.name}.xml`}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    style={{ textDecoration: "none" }}
                    startIcon={<RestoreFromTrash />}
                    onClick={() => ModelStore.restoreFromTrash(model.id)}
                  >
                    Restore model
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
