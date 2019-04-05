import withStyles from "@material-ui/core/styles/withStyles";
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "./Topbar";
import zoid from "zoid";

const SupersetZoidComponent = zoid.create({
  // The html tag used to render my component
  tag: "superset-component",
  // The url that will be loaded in the iframe or popup, when someone includes my component on their page
  url: "http://ec2-13-59-69-6.us-east-2.compute.amazonaws.com:8088"
});

class Analytics extends Component {

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
        <SupersetZoidComponent />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Analytics);
