import React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { Cancel, Check, Close } from "@mui/icons-material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface MultipleSelectChipProps {
  label: string;
  options: string[];
  selected: string[];
  setSelected: (selected: string[]) => void;
  multiple?: boolean;
  fullWidth?: boolean;
}

const MultipleSelectChip: React.FC<MultipleSelectChipProps> = ({
  label,
  options,
  selected,
  setSelected,
  multiple,
  fullWidth,
}) => {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof selected>) => {
    const {
      target: { value },
    } = event;
    setSelected(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl sx={{ width: fullWidth ? "100%" : 350 }} size="small">
      <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple={multiple}
        label={label}
        fullWidth={fullWidth}
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label={label} />}
        renderValue={(selected) =>
          multiple ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  deleteIcon={
                    <Cancel onMouseDown={(event) => event.stopPropagation()} />
                  }
                  onDelete={() =>
                    setSelected(selected.filter((item) => item !== value))
                  }
                />
              ))}
            </Box>
          ) : (
            <div className="d-flex flex-row justify-content-between align-items-center gap-3">
              {selected}

              <label
                onClick={() => {
                  setSelected([]);
                }}
                onMouseDown={(event) => event.stopPropagation()}
                className="d-flex flex-row align-items-center gap-1"
                style={{
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.secondary.main
                      : theme.palette.primary.main,
                  fontSize: "14px",
                  cursor: "pointer",
                  margin: 0,
                  padding: 0,
                  textAlign: "left",
                }}
              >
                <Close sx={{ width: 20 }} />
                Clear
              </label>
            </div>
          )
        }
        MenuProps={MenuProps}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            value={option}
            style={getStyles(option, selected, theme)}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultipleSelectChip;
