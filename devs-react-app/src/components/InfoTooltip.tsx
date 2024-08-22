import React from "react";
import { InputAdornment, Tooltip } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

interface Props {
  title: string;
  width?: number;
  height?: number;
  spacing?: number;
}

const InfoTooltip: React.FC<Props> = (props) => {
  return (
    <InputAdornment position="end">
      <Tooltip title={props.title}>
        <InfoOutlined
          style={{
            width: props.width ? props.width : 20,
            height: props.height ? props.height : 20,
            color: "gray",
            marginLeft: props.spacing ? props.spacing : 5,
          }}
        />
      </Tooltip>
    </InputAdornment>
  );
};

export default InfoTooltip;
