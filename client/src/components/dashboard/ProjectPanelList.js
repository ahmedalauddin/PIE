/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ProjectPanelList.js
 * Descr:    Lists projects for an organization using expansion panels.
 * Created:  2019-06-02
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-09-22
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import { Link, Redirect } from "react-router-dom";
import { getOrgId } from "../../redux";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Fab from "@material-ui/core/Fab/index";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import { connect } from "react-redux";
import { styles } from "./DashboardStyles";
import { formatDate } from "../common/UtilityFunctions";

class ProjectPanelList extends Component {
  constructor(props) {
    super(props);
    this.addProject = this.addProject.bind(this);
    this.fetchProjects = this.fetchProjects.bind(this);
    this.setEditRedirect = this.setEditRedirect.bind(this);
    this.renderClientColumn = this.renderClientColumn.bind(this);
    this.renderClientColumnHeading = this.renderClientColumnHeading.bind(this);
    this.renderEditRedirect = this.renderEditRedirect.bind(this);
    //<editor-fold desc="// Constructor set state">
    this.state = {
      order: "asc",
      orderBy: "",
      orgId: "",
      organization:"",
      orgName: "",
      allClients: this.props.allClients,      // This is whether we're showing the full ValueInfinity admin project list,
                                              // or for a selected client organization.
      projects: [],
      projectId: null,
      readyToEdit: false,
      readyToRedirect: false,
      user: "",
      toProject: false,
      toProjectId: "",
      hasError: false
    };
    //</editor-fold>
    };

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  }

  fetchProjects = () => {
    let fetchUrl = "/api/projects-filtered";

    let orgId = getOrgId();
    if (parseInt(orgId) > 0) {
      console.log("Org ID = " + parseInt(orgId));
      const statusFilter = this.props.projectListFilter.status;
      const startYearFilter = this.props.projectListFilter.startYear;
      const endYearFilter = this.props.projectListFilter.endYear;
      const allClients = this.props.allClients;

      if (parseInt(orgId) > 0) {
        console.log("ProjectPanelList, before setState for filter values");
        // Use the props for the body of the fetch request.
        const reqBody = {statusFilter, startYearFilter, endYearFilter, allClients, orgId};

        fetch(fetchUrl, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(reqBody)
        })
          .then(res => {
            console.log("ProjectPanelList, after fetch");
            return res.json();
          })
          .then(projects => {
            this.setState({
              projects: projects
            });
            console.log("fetch: complete");
          });
      } else {
        this.setState({ hasError: true });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.projectListFilter !== prevProps.projectListFilter) {
      this.fetchProjects();
    }
  };

  componentDidMount() {
    console.log("componentDidMount this.props: " + JSON.stringify(this.props));
    this.fetchProjects();
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

  renderClientColumnHeading = () => {
    let clientColumnHeading = "";
    const { classes } = this.props;

    if (this.props.allClients) {
      clientColumnHeading =
        <div className={classes.column}>
          <Typography className={classes.secondaryHeading}>
            Client
          </Typography>
        </div>;
    }
    return clientColumnHeading;
  };

  renderClientColumn = (organization) => {
    let clientColumnHeading = "";
    const { classes } = this.props;

    if (this.props.allClients) {
      clientColumnHeading =
        <div className={classes.column}>
          <Typography className={classes.secondaryHeading}>
            {organization}
          </Typography>
        </div>;
    }
    return clientColumnHeading;
  };

  render() {
    const { classes } = this.props;
    if (this.state.hasError) {
      return (
        <div className={classes.column}>
          <Typography className={classes.secondaryHeading}>
            Client
          </Typography>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className={classes.root}>
          {this.renderEditRedirect()}
          <Grid container lg={10} justify="center">
            <Grid lg={10} item>
              <ExpansionPanel expanded={false}>
                <ExpansionPanelSummary>
                  <div className={classes.narrowColumn}>
                  </div>
                  <div className={classes.column}>
                    <Typography className={classes.heading}>
                      Project title
                    </Typography>
                  </div>
                  {this.renderClientColumnHeading()}
                  <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>
                      Status
                    </Typography>
                  </div>
                  <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>
                      Targeted KPI
                    </Typography>
                  </div>
                  <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>
                      Start date
                    </Typography>
                  </div>
                  <div className={classes.column}>
                    <Typography className={classes.secondaryHeading}>
                      End date
                    </Typography>
                  </div>
                </ExpansionPanelSummary>
              </ExpansionPanel>
              {this.state.projects.map(project => {
                return (
                  <ExpansionPanel key={project.id}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <div className={classes.narrowColumn}>
                        <IconButton onClick={() => {this.setEditRedirect(project.id);}}>
                          <EditIcon color="primary" />
                        </IconButton>
                      </div>
                      <div className={classes.column}>
                        <Typography className={classes.heading}>
                          {project.projectTitle}
                        </Typography>
                      </div>
                      {this.renderClientColumn(project.organization)}
                      <div className={classes.column}>
                        <Typography className={classes.secondaryHeading}>
                          {project.status}
                        </Typography>
                      </div>
                      <div className={classes.column}>
                        <Typography className={classes.secondaryHeading}>
                          {project.mainKpi}
                        </Typography>
                      </div>
                      <div className={classes.column}>
                        <Typography className={classes.secondaryHeading}>
                          {formatDate(project.startAt)}
                        </Typography>
                      </div>
                      <div className={classes.column}>
                        <Typography className={classes.secondaryHeading}>
                          {formatDate(project.endAt)}
                        </Typography>
                      </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.details}>
                      <Grid container spacing={3}>
                        <Grid item xs>
                          <Typography className={classes.secondaryHeading} component="p">
                            Owner: {project.owners}<br/>
                          </Typography>
                        </Grid>
                        <Grid item xs>
                          <Typography className={classes.secondaryHeading} component="p">
                            Team: {project.team}<br/>
                          </Typography>
                        </Grid>
                        <Grid item xs>
                          <Typography className={classes.secondaryHeading} component="p">
                            <div>Tasks</div>
                            { project.tasks}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                );
              })}
              <br/>
              <br/>
              <Fab component={Link} color="primary" aria-label="Add" to={`/project`} className={classes.fab}>
                <AddIcon />
              </Fab>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    projectListFilter: state.projectListFilter
  };
};

export default withStyles(styles)(connect(mapStateToProps)(ProjectPanelList));
