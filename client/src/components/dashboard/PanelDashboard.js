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
import DashboardFilter from "./DashboardFilter";
import ProjectPanelList from "./ProjectPanelList";

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

class PanelDashboard extends Component {
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
    projects: [],
    projectId: null,
    statusFilter: [],
    startYearFilter: [],
    endYearFilter:[],
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

  updateFilter = ({statusFilter, startYearFilter, endYearFilter}) => {
    this.setState({
      statusFilter: statusFilter,
      startYearFilter: startYearFilter,
      endYearFilter: endYearFilter,
    });
    console.log(JSON.stringify(statusFilter));
    console.log(JSON.stringify(startYearFilter));
    console.log(JSON.stringify(endYearFilter));
  };

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;
    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

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
          <Grid container lg={10} direction="row" justify="center" alignSelf="end" alignItems="flex-end">
            <DashboardFilter filter={this.updateFilter}/>
            <ProjectPanelList statusFilter={this.state.statusFilter} startYearFilter={this.state.startYearFilter}
              endYearFilter={this.state.endYearFilter}/>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PanelDashboard);
