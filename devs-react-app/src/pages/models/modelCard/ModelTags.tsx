import { Chip, Typography } from "@mui/material";
import { Tag } from "../../../entities/tag";

interface ModelTagsProps {
  tags: Tag[];
}

export const ModelTags: React.FC<ModelTagsProps> = ({ tags }) => {
  return (
    <div
      style={{
        paddingTop: 10,
        maxWidth: "150px",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {tags.length ? (
        tags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            style={{
              fontSize: 12,
              marginRight: 10,
            }}
            color={"secondary"}
          />
        ))
      ) : (
        <Typography fontSize={12} color={"GrayText"}>
          No tags added yet
        </Typography>
      )}
    </div>
  );
};
