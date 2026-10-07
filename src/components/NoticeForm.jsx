import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { withTheme, withStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import { bindActionCreators } from "redux";
import { Badge } from "@mui/material";
import AttachIcon from "@mui/icons-material/AttachFile";
import ReplayIcon from "@mui/icons-material/Replay";
import CachedIcon from "@mui/icons-material/Cached";
import {
    formatMessageWithValues, withModulesManager, historyPush, journalize,
    Form, ProgressOrError, formatMessage, coreAlert, coreConfirm, withHistory,
    Helmet
} from "@openimis/fe-core";
import NoticeMasterPanel from "../components/NoticeMasterPanel";
import NoticeAttachmentsDialog from "../components/NoticeAttachmentsDialog";
import { createNotice, updateNotice, getNotice } from "../actions";
import { RIGHT_NOTICE_ADD, RIGHT_NOTICE_EDIT } from "../constants";

const styles = theme => ({
    page: theme.page,
    paperHeaderAction: theme?.paper?.action || {},
});

const StyledDiv = styled("div")(({ theme }) => ({
    "&.lockedPage": {
        ...theme?.page?.locked ?? {},
    },
}));

class NoticeForm extends Component {
    state = {
        lockNew: false,
        reset: 0,
        notice_uuid: null,
        notice: this._newNotice(),
        newNotice: true,
        isSaved: false,
        attachmentsNotice: null,
        readOnlyAfterSave: false,
        forcedDirty: false,
    }

    _newNotice() {
        return {
            uuid: null,
            title: "",
            description: "",
            priority: "MEDIUM",
            healthFacility: null,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: null,
            isActive: true,
            attachmentsCount: 0,
            schedulePublish: false,
            publishStartDate: null,
        };
    }

    componentDidMount() {
        if (this.props.notice_uuid) {
            this.setState(
                { notice_uuid: this.props.notice_uuid },
                () => this.props.getNotice(
                    this.props.modulesManager,
                    this.props.notice_uuid
                )
            );
        }
    }

    back = () => {
        const { modulesManager, history } = this.props;
        historyPush(modulesManager, history, "notice.route.notices");
    }

    componentDidUpdate(prevProps) {
        if (prevProps.fetchedNotice !== this.props.fetchedNotice && this.props.fetchedNotice) {
            const notice = this.props.notice;
            this.setState({
                notice,
                notice_uuid: notice.uuid,
                lockNew: false,
                newNotice: false,
                isSaved: false,
                readOnlyAfterSave: false,
            });
        } else if (prevProps.notice_uuid && !this.props.notice_uuid) {
            this.setState({
                notice: this._newNotice(),
                newNotice: true,
                lockNew: false,
                isSaved: false,
                notice_uuid: null,
                readOnlyAfterSave: false
            });
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState({
                reset: this.state.reset + 1,
                isSaved: true,
                lockNew: false,
                readOnlyAfterSave: true,
            });
        }
    }

    _add = () => {
        this.setState(
            (state) => ({
                notice: this._newNotice(),
                newNotice: true,
                lockNew: false,
                isSaved: false,
                readOnlyAfterSave: false,
                reset: state.reset + 1,
            }),
            () => {
                if (this.props.add) {
                    this.props.add();
                }
                this.forceUpdate();
            }
        );
    }

    reload = () => {
        this.setState({ readOnlyAfterSave: false, isSaved: false, lockNew: false });
        if (this.state.notice_uuid) {
            this.props.getNotice(
                this.props.modulesManager,
                this.state.notice_uuid
            );
        }
    }

    canSave = () => {
        const { notice } = this.state;
        if (!notice.title) return false;
        if (!notice.description) return false;
        if (!notice.priority) return false;
        return true;
    }

    _save = (notice) => {
        if (!this.canSave()) {
            this.props.coreAlert(
                formatMessage(this.props.intl, "notice", "notice.missingFields") || "Missing Fields",
                formatMessage(this.props.intl, "notice", "notice.fillRequiredFields") || "Please fill in all required fields."
            );
            this.setState({ reset: this.state.reset + 1 });
            return;
        }
        this.setState(
            { lockNew: !notice.uuid, isSaved: true },
            () => this.props.save(notice)
        );
    }

    onEditedChanged = notice => {
        this.setState({ notice, newNotice: false });
    }

    render() {
        const {
            intl, notice_uuid, fetchingNotice, fetchedNotice, errorNotice,
            add, save, rights, submittingMutation
        } = this.props;
        const { notice, readOnlyAfterSave, isSaved, lockNew } = this.state;

        const hasPermission = notice_uuid ? rights.includes(RIGHT_NOTICE_EDIT) : rights.includes(RIGHT_NOTICE_ADD);
        let readOnly = readOnlyAfterSave || isSaved || lockNew || !hasPermission || !!submittingMutation;

        const actions = [];
        if (notice_uuid) {
            actions.push({
                doIt: this.reload,
                icon: <ReplayIcon />,
                onlyIfDirty: !readOnly,
            });
        }

        if (isSaved) {
            actions.push({
                doIt: this._add,
                icon: <CachedIcon />,
            });
        }

        actions.push({
            doIt: () => this.setState({ attachmentsNotice: notice }),
            icon: (
                <Badge badgeContent={notice.attachmentsCount || 0} color="primary">
                    <AttachIcon />
                </Badge>
            ),
        });

        return (
            <div>
                <StyledDiv className={readOnly ? "lockedPage" : null}>
                    <Helmet
                        title={formatMessageWithValues(this.props.intl, "notice", "NoticeForm.title", {
                            code: notice_uuid || ""
                        })}
                    />
                    <ProgressOrError progress={fetchingNotice} error={errorNotice} />

                    <NoticeAttachmentsDialog
                        notice={this.state.attachmentsNotice}
                        close={() => this.setState({ attachmentsNotice: null })}
                        onUpdated={() => this.setState({ forcedDirty: true })}
                    />
                    {(fetchedNotice || !notice_uuid) && (
                        <Form
                            module="notice"
                            edited_id={notice_uuid}
                            edited={notice}
                            reset={this.state.reset}
                            title={notice_uuid ? "NoticeForm.title" : "NoticeForm.title.new"}
                            titleParams={{ code: notice_uuid || "" }}
                            back={this.back}
                            add={add && rights.includes(RIGHT_NOTICE_ADD) && !this.state.newNotice ? this._add : null}
                            save={save && !readOnly && hasPermission ? this._save : null}
                            canSave={this.canSave}
                            reload={(notice_uuid || readOnly) && this.reload}
                            readOnly={readOnly}
                            HeadPanel={NoticeMasterPanel}
                            Panels={[]}
                            onEditedChanged={this.onEditedChanged}
                            actions={actions}
                            forcedDirty={this.state.forcedDirty}
                        />)}
                </StyledDiv>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    fetchingNotice: state.notice?.fetchingNotice,
    errorNotice: state.notice?.errorNotice,
    fetchedNotice: state.notice?.fetchedNotice,
    notice: state.notice?.notice,
    submittingMutation: state.notice?.submittingMutation,
    mutation: state.notice?.mutation,
    rights: state.core?.user?.i_user?.rights || [],
    confirmed: state.core?.confirmed,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createNotice, updateNotice, getNotice, journalize, coreAlert, coreConfirm }, dispatch);
};

export default withHistory(
    withModulesManager(
        connect(mapStateToProps, mapDispatchToProps)(
            injectIntl(withTheme(withStyles(styles)(NoticeForm)))
        )
    )
);
