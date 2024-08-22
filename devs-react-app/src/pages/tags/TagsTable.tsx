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
} from "@mui/material";
import {
  Create,
  DeleteForever,
  Search,
  Tag as TagIcon,
} from "@mui/icons-material";
import { IconButton, Button } from "@mui/material";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import TagStore from "../../stores/TagStore";
import { Tag } from "../../entities/tag";
import moment from "moment";
import AddEditTag from "../../components/AddEditTag";

export const TagsTable = () => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedTag, setSelectedTag] = React.useState<Tag | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getAdminTags = async () => {
    const tags = await TagStore.getAdminTags();
    setFilteredTags(tags);
    setDataLoaded(true);
  };

  useEffect(() => {
    if (!dataLoaded) getAdminTags();
  }, [dataLoaded]);

  const filterTags = (tags: Tag[], searchTerm: string) => {
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    return tags.filter((tag) => {
      const normalizedName = tag.name.toLowerCase();
      return normalizedName.includes(normalizedSearchTerm);
    });
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredTags(TagStore.adminTags);
    }
    const filteredUsers = filterTags(TagStore.adminTags, searchTerm);
    setFilteredTags(filteredUsers);
  }, [searchTerm, TagStore.tags]);

  const handleClick = (tagId: number) => {
    const tagFinded = TagStore.adminTags.find((tag) => tag.id === tagId);
    if (tagFinded) setSelectedTag(tagFinded);
    setDialogOpen(true);
  };

  const handleDelete = async (tagId: number) => {
    await TagStore.deleteTag(tagId);
    setDataLoaded(false);
  };

  const handleCloseEdit = () => {
    setDialogOpen(false);
    setSelectedTag(null);
  };

  return (
    <>
      <div className="d-flex flex-col justify-content-between align-items-center h-50 mb-3">
        <div className="d-flex flex-row gap-3">
          <Typography variant="h4" style={{ fontWeight: "bold" }}>
            Tags
          </Typography>
          <Button
            sx={{ height: "100%", width: "25ch" }}
            variant="outlined"
            startIcon={<TagIcon />}
            onClick={() => setDialogOpen(true)}
            color={theme.palette.mode === "dark" ? "secondary" : "primary"}
          >
            Add new tag
          </Button>
        </div>
      </div>

      <TextField
        fullWidth
        id="input-with-icon-textfield"
        value={searchTerm}
        size="small"
        sx={{ marginBottom: 2 }}
        placeholder="Search on tags"
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
        {TagStore.isLoading && <LoadingAnimation text="Loading tags" />}
        {!filteredTags.length && !TagStore.isLoading && (
          <Typography sx={{ textAlign: "center" }}> No tags found </Typography>
        )}
        {dataLoaded && !!filteredTags.length && (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Updated</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTags.map((tag) => {
                    return (
                      <TableRow key={tag.id}>
                        <TableCell>{tag.id}</TableCell>
                        <TableCell>{tag.name}</TableCell>
                        <TableCell>
                          {moment(tag.createDate).fromNow()}
                        </TableCell>
                        <TableCell>
                          {tag.updateDate
                            ? moment(tag.updateDate).fromNow()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="large"
                            edge="start"
                            sx={{ mr: 2 }}
                            onClick={() => handleClick(tag.id)}
                          >
                            <Create />
                          </IconButton>
                          <IconButton
                            size="large"
                            edge="start"
                            sx={{ mr: 2 }}
                            onClick={() => handleDelete(tag.id)}
                          >
                            <DeleteForever />
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
      </Paper>

      <AddEditTag
        open={dialogOpen}
        onClose={handleCloseEdit}
        tag={selectedTag}
      />
    </>
  );
};
