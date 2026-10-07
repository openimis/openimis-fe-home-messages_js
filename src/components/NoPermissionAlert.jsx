import React, { Component } from "react";
import { withStyles } from "@mui/styles";
import { injectIntl, formatMessageWithValues } from "@openimis/fe-core";
import { Typography, Box } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const styles = (theme) => ({
  alert: {
    padding: theme.spacing(2),
    borderLeft: `4px solid ${theme.palette.warning.main || "#ff9800"}`,
    backgroundColor: "#fff3e0",
    borderRadius: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing(2),
    boxShadow: theme.shadows[1],
  },
  icon: {
    marginRight: theme.spacing(2),
    color: theme.palette.warning.main || "#ff9800",
  },
  text: {
    color: theme.palette.text.primary,
  },
});

class NoPermissionAlert extends Component {
  render() {
    const { intl, classes, permission } = this.props;
    return (
      <Box className={classes.alert}>
        <WarningIcon className={classes.icon} />
        <Typography variant="body1" className={classes.text}>
         <b>No Permission</b>
        </Typography>
      </Box>
    );
  }
}

export default injectIntl(withStyles(styles)(NoPermissionAlert));