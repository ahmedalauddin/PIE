// mindmap component
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import { styles } from "../MaterialSense";
import mxGraphGridAreaEditor from "./mxGraphGridAreaEditor";
//const gr = require("mxgraph-js");

// TODO this page should get the data for the control, then pass it in

class MindMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    //this.LoadGraph = this.LoadGraph.bind(this);
  }

  componentDidMount() {
    this.LoadGraph();
  }

  //LoadGraph = () => {};

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div className={classes.root}>
          <Paper>
            <mxGraphGridAreaEditor />
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(MindMap);
