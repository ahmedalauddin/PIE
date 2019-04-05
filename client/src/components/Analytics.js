import withStyles from "@material-ui/core/styles/withStyles";
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "./Topbar";
import Frame from 'react-frame-component';
import { styles } from "./styles/MaterialSense";

const supersetUrl = "http://ec2-13-59-69-6.us-east-2.compute.amazonaws.com:8088";

class Analytics extends Component {


  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <Frame>
          { supersetUrl }
        </Frame>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Analytics);
