// Shimmer.js
import React from "react";
import { withStyles } from "@mui/styles";
import { Box } from "@mui/material";

const styles = (theme) => ({
  page: {
    ...theme.page, // Ensure full width from theme.page
    position: "relative", // For FAB positioning
    width: "100%", // Explicitly full width
  },
  title: {
    width: 200,
    height: 36, // Approximate height of h4
    backgroundColor: theme.palette.grey[300],
    borderRadius: 4,
    marginBottom: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    animation: "$shimmer 1.5s infinite linear",
    background: `linear-gradient(to right, ${theme.palette.grey[300]} 8%, ${theme.palette.grey[200]} 18%, ${theme.palette.grey[300]} 33%)`,
    backgroundSize: "800px 104px",
  },
  list: {
    width: "100%", // Match List full width
    padding: theme.spacing(2), // Match List padding
  },
  shimmerItem: {
    display: "flex",
    alignItems: "center",
    width: "100%", // Full width to match ListItem
    padding: theme.spacing(2), // Match ListItem padding
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.spacing(1), // Match ListItem borderRadius
    marginBottom: theme.spacing(1),
    transition: "background-color 0.3s ease-in-out", // Match ListItem hover transition
  },
  shimmerDivider: {
    height: 1,
    width: "100%", // Full width to match Divider
    backgroundColor: theme.palette.grey[300],
    marginBottom: theme.spacing(1),
  },
  shimmerCalendarBox: {
    width: 60, // Match calendarBox width
    height: 60, // Match calendarBox height
    backgroundColor: theme.palette.grey[300],
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(2), // Match calendarBox margin
    flexShrink: 0, // Match calendarBox flexShrink
    animation: "$shimmer 1.5s infinite linear",
    background: `linear-gradient(to right, ${theme.palette.grey[300]} 8%, ${theme.palette.grey[200]} 18%, ${theme.palette.grey[300]} 33%)`,
    backgroundSize: "800px 104px",
  },
  shimmerContent: {
    flexGrow: 1, // Allow content to grow fully
    maxWidth: "60%", // Match noticeContent maxWidth
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1), // Space between elements
    width: "100%", // Ensure it stretches within its flex container
  },
  shimmerTitle: {
    width: "80%", // Relative to shimmerContent
    height: 24, // Approximate height of subtitle1
    backgroundColor: theme.palette.grey[300],
    borderRadius: 4,
    animation: "$shimmer 1.5s infinite linear",
    background: `linear-gradient(to right, ${theme.palette.grey[300]} 8%, ${theme.palette.grey[200]} 18%, ${theme.palette.grey[300]} 33%)`,
    backgroundSize: "800px 104px",
  },
  shimmerDescription: {
    width: "100%", // Full width within shimmerContent
    height: 16, // Approximate height of body2
    backgroundColor: theme.palette.grey[300],
    borderRadius: 4,
    animation: "$shimmer 1.5s infinite linear",
    background: `linear-gradient(to right, ${theme.palette.grey[300]} 8%, ${theme.palette.grey[200]} 18%, ${theme.palette.grey[300]} 33%)`,
    backgroundSize: "800px 104px",
  },
  shimmerDetails: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.spacing(2), // Match spacing in details section
    width: "100%", // Ensure full width within shimmerContent
  },
  shimmerIcon: {
    width: 16, // Approximate size of small icons
    height: 16,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 4,
    animation: "$shimmer 1.5s infinite linear",
    background: `linear-gradient(to right, ${theme.palette.grey[300]} 8%, ${theme.palette.grey[200]} 18%, ${theme.palette.grey[300]} 33%)`,
    backgroundSize: "800px 104px",
  },
  shimmerFacility: {
    width: 120, // Approximate width of facility name
    height: 16,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 4,
    animation: "$shimmer 1.5s infinite linear",
    background: `linear-gradient(to right, ${theme.palette.grey[300]} 8%, ${theme.palette.grey[200]} 18%, ${theme.palette.grey[300]} 33%)`,
    backgroundSize: "800px 104px",
  },
  shimmerChip: {
    width: 60, // Approximate width of Chip
    height: 24,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 12,
    animation: "$shimmer 1.5s infinite linear",
    background: `linear-gradient(to right, ${theme.palette.grey[300]} 8%, ${theme.palette.grey[200]} 18%, ${theme.palette.grey[300]} 33%)`,
    backgroundSize: "800px 104px",
  },
  shimmerAction: {
    width: "15%", // Match secondaryAction width
    display: "flex",
    justifyContent: "flex-end",
    gap: theme.spacing(2), // Space between switch and button placeholders
  },
  shimmerSwitch: {
    width: 40, // Approximate width of Switch
    height: 20,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 10,
    animation: "$shimmer 1.5s infinite linear",
    background: `linear-gradient(to right, ${theme.palette.grey[300]} 8%, ${theme.palette.grey[200]} 18%, ${theme.palette.grey[300]} 33%)`,
    backgroundSize: "800px 104px",
  },
  shimmerButton: {
    width: 36, // Approximate width of IconButton
    height: 36,
    backgroundColor: theme.palette.grey[300],
    borderRadius: "50%",
    animation: "$shimmer 1.5s infinite linear",
    background: `linear-gradient(to right, ${theme.palette.grey[300]} 8%, ${theme.palette.grey[200]} 18%, ${theme.palette.grey[300]} 33%)`,
    backgroundSize: "800px 104px",
  },
  shimmerPagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    width: "100%", // Full width for pagination
  },
  shimmerPaginationButton: {
    width: 36,
    height: 36,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 4,
    animation: "$shimmer 1.5s infinite linear",
    background: `linear-gradient(to right, ${theme.palette.grey[300]} 8%, ${theme.palette.grey[200]} 18%, ${theme.palette.grey[300]} 33%)`,
    backgroundSize: "800px 104px",
  },
  shimmerPaginationText: {
    width: 100,
    height: 20,
    backgroundColor: theme.palette.grey[300],
    borderRadius: 4,
    animation: "$shimmer 1.5s infinite linear",
    background: `linear-gradient(to right, ${theme.palette.grey[300]} 8%, ${theme.palette.grey[200]} 18%, ${theme.palette.grey[300]} 33%)`,
    backgroundSize: "800px 104px",
  },
  fab: {
    ...theme.fab, // Match FAB styling
    width: 56,
    height: 56,
    backgroundColor: theme.palette.grey[300],
    borderRadius: "50%",
    animation: "$shimmer 1.5s infinite linear",
    background: `linear-gradient(to right, ${theme.palette.grey[300]} 8%, ${theme.palette.grey[200]} 18%, ${theme.palette.grey[300]} 33%)`,
    backgroundSize: "800px 104px",
  },
  "@keyframes shimmer": {
    "0%": {
      backgroundPosition: "-468px 0",
    },
    "100%": {
      backgroundPosition: "468px 0",
    },
  },
});

const Shimmer = ({ classes }) => (
  <div className={classes.page}>
    {/* Title Placeholder */}
    <div className={classes.title} />

    {/* List Placeholder */}
    <div className={classes.list}>
      {[...Array(5)].map((_, index) => (
        <React.Fragment key={index}>
          <div className={classes.shimmerItem}>
            {/* Calendar Box */}
            <div className={classes.shimmerCalendarBox} />

            {/* Notice Content */}
            <div className={classes.shimmerContent}>
              {/* Title with Icon */}
              <div className={classes.shimmerTitle} />
              {/* Description */}
              <div className={classes.shimmerDescription} />
              {/* Health Facility and Priority */}
              <div className={classes.shimmerDetails}>
                <div className={classes.shimmerIcon} />
                <div className={classes.shimmerFacility} />
                <div className={classes.shimmerIcon} />
                <div className={classes.shimmerChip} />
              </div>
            </div>

            {/* Secondary Action */}
            <div className={classes.shimmerAction}>
              <div className={classes.shimmerSwitch} />
              <div className={classes.shimmerButton} />
            </div>
          </div>
          {index < 4 && <div className={classes.shimmerDivider} />}
        </React.Fragment>
      ))}
    </div>

    {/* Pagination Placeholder */}
    <div className={classes.shimmerPagination}>
      <div className={classes.shimmerPaginationButton} />
      <div className={classes.shimmerPaginationText} />
      <div className={classes.shimmerPaginationButton} />
    </div>

    {/* FAB Placeholder */}
    <div className={classes.fab} />
  </div>
);

export default withStyles(styles)(Shimmer);