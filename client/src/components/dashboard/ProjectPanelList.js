/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ProjectPanelList.js
 * Descr:    Lists projects for an organization using expansion panels.
 * Created:  2019-06-02
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-06-02
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/index";
import { Link, Redirect } from "react-router-dom";
import { getOrgId, getOrgName } from "../../redux";
import moment from "moment/moment";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/index";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/index";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/index";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Fab from "@material-ui/core/Fab/index";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import FormHelperText from "@material-ui/core/FormHelperText";
import DashboardFilter from "./DashboardFilter";

const rows = [
  { id: "name", numeric: false, disablePadding: true, label: "Project Name" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "task", numeric: false, disablePadding: true, label: "Pending Action" },
  { id: "owners", numeric: false, disablePadding: true, label: "Owners" },
  { id: "audience", numeric: false, disablePadding: true, label: "Audience" },
  { id: "mainKpi", numeric: false, disablePadding: true, label: "Targeted KPI" },
  { id: "progress", numeric: true, disablePadding: false, label: "Progress" },
  { id: "start", numeric: false, disablePadding: true, label: "Start Date" },
  { id: "end", numeric: false, disablePadding: true, label: "End Date" }
];
const styles = theme => ({
  chip: {
    margin: 2,
  },
  filterSelect: {
    alignItems: "flex-end",
  },
  filters: {
    alignItems: "flex-end",
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    paddingBottom: 200
  },
  grid: {
    width: 1200,
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "15%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 170,
    maxWidth: 450,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "15%",
  },
  narrowColumn: {
    flexBasis: "5%",
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  }
});

var msg = "";

class ProjectPanelList extends Component {
  constructor(props) {
    super(props);
    this.addProject = this.addProject.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  };

  state = {
    order: "asc",
    orderBy: "",
    orgId: "",
    organization:"",
    orgName: "",
    selected: [],
    selectedYrs: [],
    statusFilter: this.props.statusFilter,
    startYearFilter: this.props.startYearFilter,
    endYearFilter: this.props.endYearFilter,
    projects: [],
    projectId: null,
    status: [],
    startYear: [],
    endYear: [],
    readyToEdit: false,
    readyToRedirect: false,
    user: "",
    toProject: false,
    toProjectId: "",
    hasError: false
  };

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  componentDidMount() {
    // Get the organization from the filter.
    let orgName = getOrgName();
    let orgId = getOrgId();

    if (parseInt(orgId) > 0) {
      // Try to use the filter api for everything for now.
      /*
      fetch("/api/projects-dashboard/" + orgId)
        .then(res => {
          return res.json();
        })
        .then(projects => {
          this.setState({
            projects: projects,
            orgName: orgName,
            orgId: orgId
          });
        });   */

      fetch("/api/projects-filtered", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then(res => {
          return res.json();
        })
        .then(projects => {
          this.setState({
            projects: projects
          });
        });
      }
  };

  formatDate(dateInput) {
    let dateOut = "";
    if (dateInput !== null) {
      dateOut = moment(dateInput).format("YYYY-MM-DD");
    }
    return dateOut;
  }

  handleClick = (event, id) => {};

  addProject = () => {
    return <Redirect to="/newproject" />;
  };

  handleChange = event => {
    this.setState({ status: event.target.value });
  };

  handleStartYearChange = event => {
    this.setState({ startYear: event.target.value });
  };

  handleEndYearChange = event => {
    this.setState({ endYear: event.target.value });
  };

  setEditRedirect = (projectId) => {
    this.setState({
      readyToEdit: true,
      projectId: projectId
    });
  }

  renderEditRedirect = () => {
    if (this.state.readyToEdit) {
      return <Redirect to={`/project/${this.state.projectId}`} />;
    }
  }

  handleUpdate = (event) => {
    event.preventDefault();
    setTimeout(() => {
      fetch("/api/projects-filtered", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then(res => {
          return res.json();
        })
        .then(projects => {
          this.setState({
            projects: projects
          });
        });
    }, 2000);
  };

  render() {
    const { classes } = this.props;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (
      <React.Fragment>
        <Grid container lg={10} justify="center" spacing={3}>
          <Grid lg={10} item spacing={3}>
            <ExpansionPanel expanded={false}>
              <ExpansionPanelSummary>
                <div className={classes.narrowColumn}>
                </div>
                <div className={classes.column}>
                  <Typography className={classes.heading}>
                    Project title
                  </Typography>
                </div>
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
                        {this.formatDate(project.startAt)}
                      </Typography>
                    </div>
                    <div className={classes.column}>
                      <Typography className={classes.secondaryHeading}>
                        {this.formatDate(project.endAt)}
                      </Typography>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.details}>
                    <div>
                      <Typography className={classes.secondaryHeading}>
                        Owners: {project.owners}<br/>
                        Tasks: {project.tasks}
                      </Typography>
                    </div>
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
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProjectPanelList);
