// PriorityChip.js
import React from "react";
import { Chip } from "@mui/material";
import { withStyles } from "@mui/styles";

const styles = (theme) => ({
  priorityChip: {
    height: 24, // Flat height
    borderRadius: 4, // Rectangular with slight rounding
    fontWeight: 500,
    "& .MuiChip-label": {
      padding: theme.spacing(0, 1), // Compact padding
    },
  },
});

const PriorityChip = ({ classes, priority }) => {
  const getBackgroundColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "#f44336"; // Red
      case "MEDIUM":
        return "#ff9800"; // Orange
      case "LOW":
        return "#4caf50"; // Green
      default:
        return "#757575"; // Grey for N/A or undefined
    }
  };

  return (
    <Chip
      label={priority || "N/A"}
      className={classes.priorityChip}
      style={{
        backgroundColor: getBackgroundColor(priority),
        color: "#fff", 
      }}
    />
  );
};

export default withStyles(styles)(PriorityChip);