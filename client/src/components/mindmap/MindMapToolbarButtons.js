/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/components/mindmap/MindMapToolbar.jsx
 * Created:  2019-03-16 20:35:41
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-17 17:58:32
 * Editor:   Darrin Tisdale
 */

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import YoutubeSearchedForIcon from "@material-ui/icons/YoutubeSearchedFor";
import SaveIcon from "@material-ui/icons/Save";
import BugReportIcon from "@material-ui/icons/BugReport";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});

export class MindMapToolbarButtons extends React.Component {
  constructor(props) {
    super(props);

    this.handleSave = this.handleSave.bind(this);
    this.handleZoomIn = this.handleZoomIn.bind(this);
    this.handleZoomOut = this.handleZoomOut.bind(this);
    this.handleZoomRestore = this.handleZoomRestore.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleRedo = this.handleRedo.bind(this);
    this.handleDumpJSON = this.handleDumpJSON.bind(this);
  }
  handleSave = e => {
    e.preventDefault();
    this.props.callbacks.handleSave(e);
  };
  handleZoomIn = e => {
    e.preventDefault();
    this.props.callbacks.handleZoomIn(e);
  };
  handleZoomOut = e => {
    e.preventDefault();
    this.props.callbacks.handleZoomOut(e);
  };
  handleZoomRestore = e => {
    e.preventDefault();
    this.props.callbacks.handleZoomRestore();
  };
  handleUndo = e => {
    e.preventDefault();
    this.props.callbacks.handleUndo(e);
  };
  handleRedo = e => {
    e.preventDefault();
    this.props.callbacks.handleRedo(e);
  };
  handleDumpJSON = e => {
    e.preventDefault();
    this.props.callbacks.handleDumpJSON(e);
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleSave}
        >
          Save
          <SaveIcon className={classes.rightIcon} />
        </Button>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          onClick={this.handleUndo}
        >
          Undo
          <UndoIcon className={classes.rightIcon} />
        </Button>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          onClick={this.handleRedo}
        >
          Redo
          <RedoIcon className={classes.rightIcon} />
        </Button>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          onClick={this.handleZoomIn}
        >
          Zoom In
          <ZoomInIcon className={classes.rightIcon} />
        </Button>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          onClick={this.handleZoomOut}
        >
          Zoom Out
          <ZoomOutIcon className={classes.rightIcon} />
        </Button>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          onClick={this.handleZoomRestore}
        >
          Restore
          <YoutubeSearchedForIcon className={classes.rightIcon} />
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={this.handleDumpJSON}
        >
          JSON
          <BugReportIcon className={classes.rightIcon} />
        </Button>
      </div>
    );
  }
}

MindMapToolbarButtons.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MindMapToolbarButtons);
