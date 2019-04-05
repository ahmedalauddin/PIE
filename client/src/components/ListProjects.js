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
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "./Topbar";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { Link, Redirect } from "react-router-dom";
import { styles } from "./styles/MaterialSense";
import { stableSort, getSorting } from "./TableFunctions";
import Button from "@material-ui/core/Button";
import { getOrgId, getOrgName } from "../redux";

const rows = [
  { id: "id", numeric: true, disablePadding: false, label: "ID" },
  { id: "name", numeric: false, disablePadding: true, label: "Project Name" },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description"
  }
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

class ListProjects extends Component {
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

  componentDidMount() {
    // Get the organization from the filter.
    let orgName = getOrgName();
    let orgId = getOrgId();

    if (parseInt(orgId) > 0) {
      // If there is an organization, select only the projects for that org.
      fetch("/api/organizations/" + orgId)
        .then(res => {
          return res.json();
        })
        .then(organization => {
          this.setState({
            projects: organization.projects,
            orgName: orgName
          });
        });
      //msg = "List of projects for organization ";
    } else {
      //this.setState({readyToRedirect: true});

      // Else select all projects.
      fetch("/api/projects")
        .then(res => res.json())
        .then(projects => this.setState({ projects }));
      msg = "List of projects for all organizations";
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
                      <Table>
                        <TableRow>
                          <TableCell>
                            <Typography color="secondary" gutterBottom>
                              Projects listed for {this.state.orgName}.
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <div className={classes.spaceTop}>
                              <Button
                                component={Link}
                                variant="contained"
                                color="primary"
                                to={`/ProjectCard`}
                              >
                                New Project
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </Table>


                    </div>
                    <div>
                      <Typography variant="body1" gutterBottom>
                        <Paper className={classes.root}>
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
                                      <TableCell align="right">
                                        {project.id}
                                      </TableCell>
                                      <TableCell align="left">
                                        <Link to={`/projectcard/${project.id}`}>
                                          {project.title}
                                        </Link>
                                      </TableCell>
                                      <TableCell width="45%" align="left">
                                        {project.description}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </Paper>
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

export default withStyles(styles)(ListProjects);
