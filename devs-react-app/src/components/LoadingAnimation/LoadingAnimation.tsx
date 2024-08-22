import { CircularProgress, useTheme } from "@mui/material";

interface LoadingAnimationProps {
  text: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ text }) => {
  const theme = useTheme();

  return (
    <div className="flex flex-column text-center">
      <CircularProgress
        color={theme.palette.mode !== "dark" ? "primary" : "secondary"}
      />
      <div>{text}</div>
    </div>
  );
};

export default LoadingAnimation;
