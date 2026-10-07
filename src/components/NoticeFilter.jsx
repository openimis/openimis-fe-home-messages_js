import React, { Component } from "react";
import _debounce from "lodash/debounce";
import { withTheme, withStyles } from "@mui/styles";
import { injectIntl } from 'react-intl';
import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import {
    withModulesManager,
    Contributions,
    ControlledField,
    TextInput,
    ConstantBasedPicker,
    PublishedComponent,
    formatMessage,
    GRID_RESPONSIVE_STANDARD,
} from "@openimis/fe-core";
import { NOTICE_PRIORITY_LEVELS } from "../constants";

const styles = theme => ({
    dialogTitle: theme?.dialog?.title || {},
    dialogContent: theme?.dialog?.content || {},
    form: {
        padding: 0
    },
    item: {
        padding: theme.spacing(1)
    },
    paperDivider: theme?.paper?.divider || {},
});

const NOTICE_FILTER_CONTRIBUTION_KEY = "notice.Filter";

class NoticeFilter extends Component {
    state = {
        showHistory: false,
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const currentShowHistory = this.props.filters?.['showHistory']?.value ?? false;
        const prevShowHistory = prevProps.filters?.['showHistory']?.value ?? false;
        if (currentShowHistory !== prevShowHistory && currentShowHistory !== this.state.showHistory) {
            this.setState({ showHistory: currentShowHistory });
        }
    }

    debouncedOnChangeFilter = _debounce(
        this.props.onChangeFilters,
        this.props.modulesManager.getConf("fe-notice", "debounceTime", 800)
    )

    _filterValue = k => {
        const { filters } = this.props;
        return filters && filters[k] ? filters[k].value : null;
    }

    _onChangeFilter = (id, value, filter) => {
        const hasValue = value !== null && value !== undefined && value !== "";
        this.debouncedOnChangeFilter([{
            id,
            value,
            filter: hasValue ? filter : ""
        }]);
    }

    _onChangeShowHistory = (event) => {
        const checked = event && event.target ? event.target.checked : !this.state.showHistory;
        let filters = [{
            id: 'showHistory',
            value: checked,
            filter: `showHistory: ${checked}`
        }];
        this.props.onChangeFilters(filters);
        this.setState({
            showHistory: checked
        });
    }

    render() {
        const { intl, classes, filters, onChangeFilters } = this.props;
        return (
            <Grid container className={classes.form} spacing={2}>
                <ControlledField module="notice" id="NoticeFilter.title" field={
                    <Grid size={GRID_RESPONSIVE_STANDARD} className={classes.item}>
                        <TextInput
                            module="notice"
                            label="notice.title"
                            name="title"
                            value={this._filterValue('title')}
                            onChange={v => this._onChangeFilter('title', v, `title_Icontains: "${v}"`)}
                        />
                    </Grid>
                } />

                <ControlledField module="notice" id="NoticeFilter.createdAt" field={
                    <Grid size={GRID_RESPONSIVE_STANDARD} className={classes.item}>
                        <PublishedComponent
                            pubRef="core.DatePicker"
                            value={this._filterValue('createdAt')}
                            module="notice"
                            label="notice.created_at"
                            onChange={v => this._onChangeFilter('createdAt', v, `createdAt: "${v}"`)}
                        />
                    </Grid>
                } />

                <ControlledField module="notice" id="NoticeFilter.priority" field={
                    <Grid size={GRID_RESPONSIVE_STANDARD} className={classes.item}>
                        <ConstantBasedPicker
                            module="notice"
                            label="notice.priority"
                            constants={NOTICE_PRIORITY_LEVELS}
                            value={this._filterValue('priority')}
                            onChange={v => this._onChangeFilter('priority', v, `priority: "${v}"`)}
                            withNull
                        />
                    </Grid>
                } />

                <ControlledField module="notice" id="NoticeFilter.health_facility" field={
                    <Grid size={GRID_RESPONSIVE_STANDARD} className={classes.item}>
                        <PublishedComponent
                            pubRef="location.HealthFacilityPicker"
                            module="notice"
                            value={this._filterValue('healthFacility')}
                            onChange={v => this._onChangeFilter('healthFacility', v, v?.uuid ? `healthFacility_Uuid: "${v.uuid}"` : "")}
                            withNull
                        />
                    </Grid>
                } />

                <ControlledField module="notice" id="NoticeFilter.description" field={
                    <Grid size={GRID_RESPONSIVE_STANDARD} className={classes.item}>
                        <TextInput
                            module="notice"
                            label="notice.description"
                            name="description"
                            value={this._filterValue('description')}
                            onChange={v => this._onChangeFilter('description', v, `description_Icontains: "${v}"`)}
                        />
                    </Grid>
                } />

                <ControlledField module="notice" id="NoticeFilter.isActive" field={
                    <Grid size={GRID_RESPONSIVE_STANDARD} className={classes.item}>
                        <PublishedComponent
                            pubRef="core.BooleanField"
                            module="notice"
                            label="notice.is_active"
                            value={this._filterValue('isActive')}
                            onChange={v => this._onChangeFilter('isActive', v, `isActive: ${v}`)}
                            withNull
                        />
                    </Grid>
                } />

                <ControlledField module="notice" id="NoticeFilter.showHistory" field={
                    <Grid size={GRID_RESPONSIVE_STANDARD} className={classes.item}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    checked={!!this.state.showHistory}
                                    onChange={this._onChangeShowHistory}
                                />
                            }
                            label={formatMessage(intl, "notice", "NoticeFilter.showHistory") || "Show historical values"}
                        />
                    </Grid>
                } />

                <Contributions filters={filters} onChangeFilters={onChangeFilters} contributionKey={NOTICE_FILTER_CONTRIBUTION_KEY} />
            </Grid>
        );
    }
}

export default withModulesManager(injectIntl(withTheme(withStyles(styles)(NoticeFilter))));
