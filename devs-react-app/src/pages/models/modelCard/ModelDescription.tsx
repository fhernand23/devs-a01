import { Typography } from "@mui/material";

interface ModelDescriptionProps {
  description: string;
}

export const ModelDescription: React.FC<ModelDescriptionProps> = ({
  description,
}) => {
  return (
    <div
      style={{
        maxWidth: 900,
        overflow: "hidden",
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      {description ? (
        <Typography fontSize={12}>{description}</Typography>
      ) : (
        <Typography fontSize={12} color={"GrayText"}>
          No description provided
        </Typography>
      )}
    </div>
  );
};
