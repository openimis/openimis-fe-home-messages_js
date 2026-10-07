import React, { Component } from "react";
import { withTheme, withStyles } from "@mui/styles";
import { Paper, Grid, Typography, FormControlLabel, Checkbox } from "@mui/material";
import {
    formatMessage,
    FormPanel,
    Contributions,
    withModulesManager,
} from "@openimis/fe-core";
import EmailIcon from "@mui/icons-material/Email";
import SmsIcon from "@mui/icons-material/Sms";

const styles = (theme) => ({
    paper: theme?.paper?.paper || {},
    paperHeader: {
        ...theme?.paper?.header || {},
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(1),
    },
    item: {
        padding: theme.spacing(1),
        display: "flex",
        alignItems: "center",
    },
    icon: {
        marginRight: theme.spacing(1),
        color: theme.palette.primary.main,
    },
    headerIcon: {
        marginRight: theme.spacing(1),
        color: theme.palette.text.secondary,
    },
});

const NOTICE_NOTIFICATION_PANEL_CONTRIBUTION_KEY = "notice.NotificationPanel";
const NOTICE_PANELS_CONTRIBUTION_KEY = "notice.panels";

class NoticeNotificationPanel extends FormPanel {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            classes,
            edited,
            title = "Notice Notifications",
            titleParams = { label: "" },
            readOnly = true,
            intl,
            modulesManager,
        } = this.props;

        if (!edited) return null;

        // Ensure sendEmail and sendSMS have default values if undefined
        const sendEmail = edited.sendEmail ?? false;
        const sendSMS = edited.sendSMS ?? false;

        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Grid container className={classes.paperHeader}>
                            <EmailIcon className={classes.headerIcon} />
                            <Typography variant="h6">
                                {formatMessage(intl, "notice", title, titleParams)}
                            </Typography>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6} className={classes.item}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={sendEmail}
                                            onChange={(e) => this.updateAttribute("sendEmail", e.target.checked)}
                                            disabled={readOnly}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <EmailIcon className={classes.icon} />
                                            {formatMessage(intl, "notice", "notice.send_email")}
                                        </div>
                                    }
                                />
                            </Grid>
                            <Grid item xs={6} className={classes.item}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={sendSMS}
                                            onChange={(e) => this.updateAttribute("sendSMS", e.target.checked)}
                                            disabled={readOnly}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <SmsIcon className={classes.icon} />
                                            {formatMessage(intl, "notice", "notice.send_sms")}
                                        </div>
                                    }
                                />
                            </Grid>
                        </Grid>

                        {/* Pass only necessary props to Contributions */}
                        <Contributions
                            edited={edited}
                            readOnly={readOnly}
                            updateAttribute={this.updateAttribute}
                            modulesManager={modulesManager}
                            contributionKey={NOTICE_PANELS_CONTRIBUTION_KEY}
                        />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default withModulesManager(withTheme(withStyles(styles)(NoticeNotificationPanel)));