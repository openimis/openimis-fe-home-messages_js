import React, { Component } from "react";
import { injectIntl } from "react-intl"; // Direct import from react-intl
import { withTheme, withStyles } from "@mui/styles";
import { withModulesManager, formatMessage } from "@openimis/fe-core";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import NoticeMasterPanel from "./NoticeMasterPanel";

const styles = (theme) => ({
  // Minimal styling, can expand if needed
});

class NoticeDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editedNotice: props.notice || {
        title: "",
        description: "",
        priority: "MEDIUM",
        health_facility: null,
        created_at: new Date().toISOString().split("T")[0], // Default to today
        is_active: true,
        send_email: false,
        send_sms: false,
      },
    };
  }

  handleSave = () => {
    this.props.onClose(this.state.editedNotice);
  };

  handleEditedChanged = (updatedNotice) => {
    this.setState({ editedNotice: updatedNotice });
  };

  render() {
    const { open, onClose, modulesManager, intl } = this.props;
    const { editedNotice } = this.state;

    return (
      <Dialog open={open} onClose={() => onClose(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editedNotice.uuid
            ? formatMessage(intl, "notice", "edit_notice")
            : formatMessage(intl, "notice", "add_notice")}
        </DialogTitle>
        <DialogContent>
          <NoticeMasterPanel
            edited={editedNotice}
            onEditedChanged={this.handleEditedChanged}
            readOnly={false}
            modulesManager={modulesManager}
            intl={intl}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(null)}>
            {formatMessage(intl, "notice", "cancel")}
          </Button>
          <Button onClick={this.handleSave} variant="contained" color="primary">
            {formatMessage(intl, "notice", "save")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withModulesManager(
  injectIntl(withTheme(withStyles(styles)(NoticeDialog)))
);