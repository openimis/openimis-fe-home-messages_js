import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import { Grid, FormControlLabel, Switch } from "@mui/material";
import {
  formatMessage,
  formatMessageWithValues,
  FormPanel,
  TextInput,
  Contributions,
  withModulesManager,
  ConstantBasedPicker,
  PublishedComponent,
  coreAlert,
  GRID_RESPONSIVE_STANDARD,
  GRID_RESPONSIVE_SMALL,
  ControlledField,
} from "@openimis/fe-core";
import { NOTICE_PRIORITY_LEVELS } from "../constants";
import NoticeDescriptionEditor from "./NoticeDescriptionEditor";

const styles = (theme) => ({
  paperHeader: theme?.paper?.header || {},
  item: theme?.paper?.item || {},
});

const NOTICE_MASTER_PANEL_CONTRIBUTION_KEY = "notice.MasterPanel";
const NOTICE_PANELS_CONTRIBUTION_KEY = "notice.panels";

const StyledItemGrid = styled(Grid)(({ theme }) => ({
  ...(theme?.paper?.item ?? {}),
}));

class NoticeMasterPanel extends FormPanel {
  updateAttributes = (updates) => {
    const current = this.props.edited || this.state.data || {};
    const data = { ...current, ...updates };
    this.setState({ data });
    if (this.props.onEditedChanged) {
      this.props.onEditedChanged(data);
    }
  };

  handleSchedulePublishChange = (checked) => {
    const { intl, edited, coreAlert } = this.props;

    if (checked) {
      this.updateAttributes({
        schedulePublish: true,
      });

      const publishDate = edited?.publishStartDate
        ? new Date(edited.publishStartDate).toLocaleDateString()
        : "the selected date";
      const message = formatMessageWithValues(intl, "notice", "schedulePublishAlert", {
        date: publishDate,
      });
      coreAlert(formatMessage(intl, "notice", "schedulePublishTitle"), message);
    } else {
      this.updateAttributes({
        schedulePublish: false,
        publishStartDate: null,
      });
    }
  };

  handleDescriptionChange = (v) => {
    this.updateAttribute("description", v);
  };

  render() {
    const {
      classes,
      edited,
      readOnly = false,
      intl,
      reset,
    } = this.props;

    if (!edited) return null;

    const ro = readOnly;

    return (
      <Grid container>
        <ControlledField
          module="notice"
          id="Notice.title"
          field={
            <StyledItemGrid size={GRID_RESPONSIVE_STANDARD} className="item">
              <TextInput
                module="notice"
                label="notice.title"
                value={edited.title}
                required={true}
                onChange={(v) => this.updateAttribute("title", v)}
                readOnly={ro}
              />
            </StyledItemGrid>
          }
        />

        <ControlledField
          module="notice"
          id="Notice.createdAt"
          field={
            <StyledItemGrid size={GRID_RESPONSIVE_SMALL} className="item">
              <PublishedComponent
                pubRef="core.DatePicker"
                value={edited.createdAt}
                onChange={(v) => this.updateAttribute("createdAt", v)}
                module="notice"
                label="notice.created_at"
                reset={reset}
                readOnly={ro}
                required={false}
              />
            </StyledItemGrid>
          }
        />

        <ControlledField
          module="notice"
          id="Notice.priority"
          field={
            <StyledItemGrid size={GRID_RESPONSIVE_SMALL} className="item">
              <ConstantBasedPicker
                module="notice"
                label="notice.priority"
                constants={NOTICE_PRIORITY_LEVELS}
                value={edited.priority}
                onChange={(v) => this.updateAttribute("priority", v)}
                required={true}
                readOnly={ro}
              />
            </StyledItemGrid>
          }
        />

        <ControlledField
          module="notice"
          id="Notice.healthFacility"
          field={
            <StyledItemGrid size={GRID_RESPONSIVE_STANDARD} className="item">
              <PublishedComponent
                pubRef="location.HealthFacilityPicker"
                value={edited.healthFacility}
                onChange={(v) => this.updateAttribute("healthFacility", v)}
                required={false}
                readOnly={ro}
              />
            </StyledItemGrid>
          }
        />

        <ControlledField
          module="notice"
          id="Notice.schedulePublish"
          field={
            <StyledItemGrid size={GRID_RESPONSIVE_SMALL} className={classes.item}>
              <FormControlLabel
                control={
                  <Switch
                    checked={edited.schedulePublish || false}
                    onChange={(e) => this.handleSchedulePublishChange(e.target.checked)}
                    color="primary"
                    disabled={ro}
                  />
                }
                label={formatMessage(intl, "notice", "notice.schedule_publish")}
              />
            </StyledItemGrid>
          }
        />

        <ControlledField
          module="notice"
          id="Notice.publishStartDate"
          field={
            <StyledItemGrid size={GRID_RESPONSIVE_SMALL} className={classes.item}>
              {edited.schedulePublish ? (
                <PublishedComponent
                  pubRef="core.DatePicker"
                  label="notice.publish_start_date"
                  value={edited.publishStartDate}
                  onChange={(date) => this.updateAttribute("publishStartDate", date)}
                  readOnly={ro}
                  minDate={new Date()}
                  required={edited.schedulePublish}
                  clearable
                />
              ) : null}
            </StyledItemGrid>
          }
        />

        <ControlledField
          module="notice"
          id="Notice.description"
          field={
            <StyledItemGrid size={{xs: 12}} className="item">
              <NoticeDescriptionEditor
                label="notice.description"
                value={edited.description}
                onChange={this.handleDescriptionChange}
                readOnly={ro}
              />
            </StyledItemGrid>
          }
        />

        <Contributions
          {...this.props}
          updateAttribute={this.updateAttribute}
          readOnly={ro}
          contributionKey={NOTICE_PANELS_CONTRIBUTION_KEY}
        />
      </Grid>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      coreAlert,
    },
    dispatch
  );
};

export default withModulesManager(
  withTheme(
    withStyles(styles)(
      connect(null, mapDispatchToProps)(NoticeMasterPanel)
    )
  )
);
