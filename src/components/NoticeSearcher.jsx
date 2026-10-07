import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import {
  withModulesManager, formatMessage, formatMessageWithValues, historyPush,
  withHistory, Searcher, PublishedComponent, coreConfirm, formatDateFromISO
} from "@openimis/fe-core";
import { fetchNotices, toggleNoticeStatus, deleteNotice } from "../actions";
import NoticeFilter from "./NoticeFilter";
import { IconButton, Switch, Tooltip } from "@mui/material";
import PriorityChip from "./PriorityChip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { RIGHT_NOTICE_EDIT, RIGHT_NOTICE_DELETE, RIGHT_NOTICE_TOGGLE_STATUS } from "../constants";

const NOTICE_SEARCHER_CONTRIBUTION_KEY = "notice.NoticeSearcher";

class NoticeSearcher extends Component {
  state = {
    reset: 0,
    noticeToDelete: null,
  }

  constructor(props) {
    super(props);
    this.rowsPerPageOptions = props.modulesManager.getConf("fe-notice", "noticeFilter.rowsPerPageOptions", [10, 20, 50, 100]);
    this.defaultPageSize = props.modulesManager.getConf("fe-notice", "noticeFilter.defaultPageSize", 10);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.confirmed !== this.props.confirmed &&
      this.props.confirmed &&
      this.state.noticeToDelete
    ) {
      const notice = this.state.noticeToDelete;
      const clientMutationLabel = formatMessageWithValues(this.props.intl, "notice", "deleteNotice.mutationLabel", {
        title: notice.title,
      }) || `Delete notice "${notice.title}"`;
      this.props.deleteNotice(this.props.modulesManager, notice.uuid, clientMutationLabel).then(() => {
        this.setState({ reset: this.state.reset + 1 });
      });
      this.setState({ noticeToDelete: null });
    }
  }

  fetch = (prms) => {
    this.props.fetchNotices(this.props.modulesManager, prms);
  }

  toggleStatus = (notice) => {
    const newStatus = !notice.isActive;
    this.props.toggleNoticeStatus(this.props.modulesManager, notice.uuid, newStatus);
  }

  deleteNotice = (notice) => {
    const { intl, coreConfirm } = this.props;
    const title = formatMessage(intl, "notice", "deleteNotice.confirm.title") || "Delete Notice";
    const message = formatMessageWithValues(intl, "notice", "deleteNotice.confirm.message", {
      title: notice.title,
    }) || `Are you sure you want to delete notice "${notice.title}"?`;

    this.setState({ noticeToDelete: notice }, () => {
      coreConfirm(title, message);
    });
  }

  rowIdentifier = (r) => r.id

  filtersToQueryParams = (state) => {
    let prms = Object.keys(state.filters)
      .filter(f => !!state.filters[f]['filter'])
      .map(f => state.filters[f]['filter']);

    prms.push(`first: ${state.pageSize}`);
    if (state.afterCursor) {
      prms.push(`after: "${state.afterCursor}"`);
    }
    if (state.beforeCursor) {
      prms.push(`before: "${state.beforeCursor}"`);
    }
    return prms;
  }

  canSelectAll = (selection) => this.props.notices.map(s => s.id).filter(s => !selection.map(s => s.id).includes(s)).length
  rowLocked = (selection, notice) => !!notice.clientMutationId

  headers = (filters) => {
    let headers = [
      "notice.uuid",
      "notice.title",
      "notice.priority",
      "notice.health_facility",
      "notice.created_at",
      "notice.updated_at",
      "notice.is_active",
    ];
    if (filters?.showHistory?.value) {
      headers.push("notice.validity_from");
      headers.push("notice.validity_to");
    }
    headers.push("notice.actions");
    return headers;
  };

  sorts = (filters) => {
    let sorts = [
      ['id', true],
      ['title', true],
      ['priority', true],
      ['health_facility', true],
      ['createdAt', true],
      ['updatedAt', true],
      ['is_active', true],
    ];
    if (filters?.showHistory?.value) {
      sorts.push(['validityFrom', false]);
      sorts.push(['validityTo', false]);
    }
    return sorts;
  };

  itemFormatters = (filters) => {
    let formatters = [
      e => e.uuid,
      e => e.title,
      e => <PriorityChip priority={e.priority} />,
      e => e.healthFacility ? (e.healthFacility.name || e.healthFacility.code || e.healthFacility.id) : "",
      e => {
        const isScheduled = e.schedulePublish && !!e.publishStartDate;
        const displayDate = isScheduled ? e.publishStartDate : e.createdAt;
        const formattedDate = displayDate && typeof displayDate === "string" ? displayDate.split("T")[0] : (displayDate || "");
        if (isScheduled) {
          return (
            <Tooltip title={formatMessage(this.props.intl, "notice", "notice.schedulePublishTitle") || "Scheduled Publishing Enabled"}>
              <span style={{ fontWeight: 500 }}>{formattedDate}</span>
            </Tooltip>
          );
        }
        return formattedDate;
      },
      e => (e.updatedAt && typeof e.updatedAt === "string" ? e.updatedAt.split("T")[0] : (e.updatedAt || "")),
      e => (
        this.props.rights.includes(RIGHT_NOTICE_TOGGLE_STATUS) ? (
          <Switch
            checked={e.isActive}
            onChange={() => this.toggleStatus(e)}
            color="primary"
            disabled={!!e.validityTo}
          />
        ) : (e.isActive ? formatMessage(this.props.intl, "notice", "notice.statusActive") : formatMessage(this.props.intl, "notice", "notice.statusInactive"))
      ),
    ];
    if (filters?.showHistory?.value) {
      formatters.push(e => formatDateFromISO(this.props.modulesManager, this.props.intl, e.validityFrom));
      formatters.push(e => formatDateFromISO(this.props.modulesManager, this.props.intl, e.validityTo));
    }
    formatters.push(e => (
      <div style={{ display: "flex", alignItems: "center" }}>
        {this.props.rights.includes(RIGHT_NOTICE_EDIT) && !e.validityTo && (
          <Tooltip title={formatMessageWithValues(this.props.intl, "notice", "editNotice")}>
            <IconButton onClick={() => historyPush(this.props.modulesManager, this.props.history, "notice.route.noticeEdit", [e.uuid])}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
        {this.props.rights.includes(RIGHT_NOTICE_DELETE) && !e.validityTo && (
          <Tooltip title={formatMessageWithValues(this.props.intl, "notice", "notice.deleteNotice")}>
            <IconButton onClick={() => this.deleteNotice(e)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    ));
    return formatters;
  };

  editNotice = c => {
    if (this.props.rights.includes(RIGHT_NOTICE_EDIT) && !c.validityTo) {
      historyPush(this.props.modulesManager, this.props.history, "notice.route.noticeEdit", [c.uuid])
    }
  }

  render() {
    const { intl, notices, noticesPageInfo, fetchingNotices, fetchedNotices, errorNotices, filterPaneContributionsKey, cacheFiltersKey, FilterExt } = this.props;
    let count = noticesPageInfo.totalCount ?? 0;

    return (
      <Fragment>
        <PublishedComponent>
          <div id="notice.route.allNotices"> </div>
        </PublishedComponent>
        <Searcher
          module="notice"
          // canSelectAll={this.canSelectAll}
          cacheFiltersKey={cacheFiltersKey}
          FilterPane={NoticeFilter}
          FilterExt={FilterExt}
          filterPaneContributionsKey={filterPaneContributionsKey}
          items={notices}
          itemsPageInfo={noticesPageInfo}
          fetchingItems={fetchingNotices}
          fetchedItems={fetchedNotices}
          errorItems={errorNotices}
          tableTitle={formatMessageWithValues(intl, "notice", "notices_table.count", { count })}
          rowsPerPageOptions={this.rowsPerPageOptions}
          defaultPageSize={this.defaultPageSize}
          fetch={this.fetch}
          rowIdentifier={this.rowIdentifier}
          filtersToQueryParams={this.filtersToQueryParams}
          defaultOrderBy="-createdAt"
          rowLocked={this.rowLocked}
          headers={this.headers}
          itemFormatters={this.itemFormatters}
          sorts={this.sorts}
          onDoubleClick={this.editNotice}
          reset={this.state.reset}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  rights: state.core?.user?.i_user?.rights || [],
  confirmed: state.core?.confirmed,
  fetchingNotices: state.notice.fetchingNotices,
  fetchedNotices: state.notice.fetchedNotices,
  notices: state.notice.notices,
  noticesPageInfo: state.notice.noticesPageInfo,
  errorNotices: state.notice.errorNotices,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchNotices,
    toggleNoticeStatus,
    deleteNotice,
    coreConfirm,
  }, dispatch);
};

export default withModulesManager(
  withHistory(
    connect(mapStateToProps, mapDispatchToProps)(
      injectIntl(NoticeSearcher)
    )
  )
);
