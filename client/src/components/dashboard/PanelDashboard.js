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
import { getOrgName, setProjectStatusFilter, setProjectStartYearFilter, setProjectEndYearFilter, store} from "../../redux";
import moment from "moment/moment";
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
    let statusFilter = [];
    let startYearFilter = [];
    let endYearFilter = [];

    // Reset filters in Redux.
    let filters = { statusFilter, startYearFilter, endYearFilter };
    store.dispatch(setProjectStatusFilter(statusFilter));
    store.dispatch(setProjectStartYearFilter(startYearFilter));
    store.dispatch(setProjectEndYearFilter(endYearFilter));
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

  /*
  updateFilter = ({statusFilter, startYearFilter, endYearFilter}) => {
    // We'll use Redux to update the filter
    let filters = {statusFilter, startYearFilter, endYearFilter};
    store.dispatch(setProjectFilter(JSON.stringify(filters)));
    console.log("PanelDashboard, project filter:" + JSON.stringify(data));
  };
   */

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
            <DashboardFilter />
            <ProjectPanelList />
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(PanelDashboard);
