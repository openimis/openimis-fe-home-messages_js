// Pagination.js
import React from "react";
import { withStyles } from "@mui/styles";
import { Button, Typography, Box } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const styles = (theme) => ({
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    gap: theme.spacing(2),
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    padding: 0,
  },
  disabledButton: {
    color: theme.palette.grey[400],
    pointerEvents: "none",
  },
});

const Pagination = ({
  classes,
  currentPage,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Box className={classes.paginationContainer}>
      <Button
        className={`${classes.pageButton} ${
          !hasPreviousPage ? classes.disabledButton : ""
        }`}
        onClick={handlePrevious}
        disabled={!hasPreviousPage}
      >
        <ChevronLeft />
      </Button>
      <Typography variant="body1">Page {currentPage}</Typography>
      <Button
        className={`${classes.pageButton} ${
          !hasNextPage ? classes.disabledButton : ""
        }`}
        onClick={handleNext}
        disabled={!hasNextPage}
      >
        <ChevronRight />
      </Button>
    </Box>
  );
};

export default withStyles(styles)(Pagination);