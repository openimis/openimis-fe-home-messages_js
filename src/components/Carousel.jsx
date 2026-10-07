import React, { Component } from "react";
import { withStyles } from "@mui/styles";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const styles = {
  carouselContainer: {
    position: "relative",
    width: "100%",
    height: "800px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  carouselItem: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  carouselNav: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    border: "none",
    padding: "10px",
  },
  carouselNavLeft: {
    left: "10px",
  },
  carouselNavRight: {
    right: "10px",
  },
};

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.supportedMimeTypes = ["application/pdf", "image/jpeg", "image/jpg"];
    this.state = {
      currentIndex: 0,
      error: null,
    };
  }

  componentDidCatch(error, info) {
    console.error("Carousel Error:", error, info);
    this.setState({ error: "Failed to render attachment preview" });
  }

  componentWillUnmount() {
    if (this.currentBlobUrl) {
      window.URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }
  }

  nextItem = () => {
    const filteredAttachments = this.getFilteredAttachments();
    this.setState((prevState) => ({
      currentIndex: Math.min(prevState.currentIndex + 1, filteredAttachments.length - 1),
    }));
  };

  prevItem = () => {
    this.setState((prevState) => ({
      currentIndex: Math.max(prevState.currentIndex - 1, 0),
    }));
  };

  getFilteredAttachments = () => {
    return this.props.attachments.filter(
      (attachment) =>
        attachment &&
        attachment.generalType === "FILE" &&
        attachment.doc &&
        this.supportedMimeTypes.includes(attachment.mime)
    );
  };

  renderCarouselItem = (attachment) => {
    if (!attachment || !attachment.doc) {
      console.warn("Invalid attachment or missing doc:", attachment);
      return <div>No preview available</div>;
    }

    try {
      if (this.currentBlobUrl) {
        window.URL.revokeObjectURL(this.currentBlobUrl);
      }
      const byteCharacters = atob(attachment.doc); // Decode Base64
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: attachment.mime });
      const url = window.URL.createObjectURL(blob);
      this.currentBlobUrl = url;

      console.log("Rendering attachment:", { mime: attachment.mime, filename: attachment.filename, url });

      if (attachment.mime === "application/pdf") {
        return (
          <iframe
            src={url}
            className={this.props.classes.carouselItem} // Use className instead of style
            title={attachment.filename || "PDF Preview"}
          />
        );
      } else if (attachment.mime === "image/jpeg" || attachment.mime === "image/jpg") {
        return (
          <img
            src={url}
            alt={attachment.filename || "Image Preview"}
            className={this.props.classes.carouselItem} // Use className instead of style
          />
        );
      }
      return <div>Unsupported file type</div>;
    } catch (error) {
      console.error("Error rendering attachment:", error, attachment);
      return <div>Error loading preview: {error.message}</div>;
    }
  };

  render() {
    const { classes, onClose } = this.props;
    const { currentIndex, error } = this.state;
    const filteredAttachments = this.getFilteredAttachments();

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <div className={classes.carouselContainer}>
        {filteredAttachments.length > 0 ? (
          <>
            {this.renderCarouselItem(filteredAttachments[currentIndex])}
            <IconButton
              className={`${classes.carouselNav} ${classes.carouselNavLeft}`}
              onClick={this.prevItem}
              disabled={currentIndex === 0}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              className={`${classes.carouselNav} ${classes.carouselNavRight}`}
              onClick={this.nextItem}
              disabled={currentIndex === filteredAttachments.length - 1}
            >
              <ArrowForwardIcon />
            </IconButton>
          </>
        ) : (
          <div>No previewable attachments</div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Carousel);