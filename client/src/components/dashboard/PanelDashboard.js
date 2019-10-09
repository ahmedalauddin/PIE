/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/PanelDashboard.js
 * Descr:    Lists projects for an organization using expansion panels.
 * Created:  2019-01-16
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-05-30
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/index";
import { Redirect } from "react-router-dom";
import { getOrgName, store, setProjectListFilter } from "../../redux";
import DashboardFilter from "./DashboardFilter";
import ProjectPanelList from "./ProjectPanelList";
import { styles } from "./DashboardStyles";

var msg = "";

class PanelDashboard extends Component {
  constructor(props) {
    super(props);
    this.addProject = this.addProject.bind(this);
    this.state = {
      order: "asc",
      orderBy: "",
      orgId: "",
      organization:"",
      orgName: "",
      projects: [],
      projectId: null,
      readyToEdit: false,
      readyToRedirect: false,
      user: "",
      toProject: false,
      toProjectId: "",
      hasError: false
    };
  }

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  componentDidMount() {
  };

  handleClick = (event, id) => {};

  addProject = () => {
    return <Redirect to="/newproject" />;
  };

  setEditRedirect = (projectId) => {
    this.setState({
      readyToEdit: true,
      projectId: projectId
    });
  };

  renderEditRedirect = () => {
    if (this.state.readyToEdit) {
      return <Redirect to={`/project/${this.state.projectId}`} />;
    }
  };

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;
    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    console.log("PanelDashboard render");

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
        <div className={classes.root}>
          {this.renderEditRedirect()}
          <Grid container justify="center">
            <Grid container spacing={24} alignItems="center" justify="flex-start" className={classes.grid}>
              <Typography variant="subtitle1" color="secondary" gutterBottom>
                Projects listed for {getOrgName()}
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" justify="center" alignItems="flex-end">
            <DashboardFilter allClients={false} />
            <ProjectPanelList allClients={false} />
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PanelDashboard);
