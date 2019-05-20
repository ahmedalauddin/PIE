/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ListProjects.js
 * Created:  2019-01-16
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-18
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table/index";
import TableBody from "@material-ui/core/TableBody/index";
import TableCell from "@material-ui/core/TableCell/index";
import TableHead from "@material-ui/core/TableHead/index";
import TableRow from "@material-ui/core/TableRow/index";
import Paper from "@material-ui/core/Paper/index";
import TableSortLabel from "@material-ui/core/TableSortLabel/index";
import Tooltip from "@material-ui/core/Tooltip/index";
import Typography from "@material-ui/core/Typography/index";
import { Link, Redirect } from "react-router-dom";
import { styles } from "../styles/MaterialSense";
import { stableSort, getSorting } from "../TableFunctions";
import { getOrgId, getOrgName } from "../../redux";
import moment from "moment/moment";

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

class MyTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? "right" : "left"}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}
var msg = "";

class ProjectDashboard extends Component {
  constructor(props) {
    super(props);
    this.handleNull = this.handleNull.bind(this);
  };

  state = {
    order: "asc",
    orderBy: "",
    orgId: "",
    organization:"",
    orgName: "",
    selected: [],
    projects: [],
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

  handleNull(refToParse) {
    try {
      if (refToParse != null) {
        return refToParse;
      } else {
        return "";
      }
    } catch (e) {
      return "";
    }
  }

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
            orgName: orgName
          });
        });
      //msg = "List of projects for organization ";
    } else {
      this.setState({hasError: true});
      return <Redirect to="/Login" />;
    }
  };

  // Using technique described here, https://tylermcginnis.com/react-router-programmatically-navigate/.
  handleClick = (event, id) => {};

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
          <Grid container justify="center">
            <Grid
              spacing={24}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid container item xs={12}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <div className={classes.box}>
                      <Typography color="secondary" gutterBottom>
                        Project Dashboard for {this.state.orgName}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="body1" gutterBottom>
                        <div className={classes.tableWrapper}>
                          <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                          >
                            <MyTableHead />
                            <TableBody>
                              {stableSort(
                                this.state.projects,
                                getSorting("asc", "title")
                              ).map(project => {
                                return (
                                  <TableRow
                                    hover
                                    onClick={event => {
                                      this.handleClick(event, project.id);
                                    }}
                                    tabIndex={-1}
                                    key={project.id}
                                  >
                                    <TableCell width="15%" align="left" padding="none">
                                      <Link to={`/projectcard/${project.id}`}>
                                        {project.projectTitle}
                                      </Link>
                                    </TableCell>
                                    <TableCell align="left" padding="none">
                                      {project.status}
                                    </TableCell>
                                    <TableCell align="left" padding="none">
                                      {project.taskName}
                                    </TableCell>
                                    <TableCell align="left" padding="none">
                                      {project.owners}
                                    </TableCell>
                                    <TableCell align="left" padding="none">
                                      Need audience here
                                    </TableCell>
                                    <TableCell align="left" padding="none">
                                      {project.mainKpi}
                                    </TableCell>
                                    <TableCell align="right">
                                      {project.progress}%
                                    </TableCell>
                                    <TableCell align="left" padding="none">
                                      {moment(project.startAt).format("YYYY-MM-DD")}
                                    </TableCell>
                                    <TableCell align="left" padding="none">
                                      {moment(project.endAt).format("YYYY-MM-DD")}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </Typography>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProjectDashboard);
