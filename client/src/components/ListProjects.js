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
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { styles } from "./MaterialSense";
import { stableSort, getSorting } from "./TableFunctions";
import Button from "@material-ui/core/Button";
import { getUser, getOrg } from "../redux";

const rows = [
  { id: "id", numeric: true, disablePadding: false, label: "ID" },
  { id: "name", numeric: false, disablePadding: true, label: "Project Name" },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description"
  },
  {
    id: "organization",
    numeric: false,
    disablePadding: false,
    label: "Organization"
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

//let userName = getUser();

var msg = "";

class ListProjects extends Component {
  state = {
    order: "asc",
    orderBy: "",
    orgId: 2,
    organization: {},
    selected: [],
    projects: [],
    toProject: "false",
    toProjectId: ""
  };

  componentDidMount() {
    if (parseInt(this.state.orgId) > 0) {
      // If there is an organization, select only the projects for that org.
      fetch(`/api/organizations/${this.state.orgId}`)
        .then(res => {
          return res.json();
        })
        .then(organization => {
          this.setState({ projects: organization.projects });
        });

      msg = "List of projects for organization ";
    } else {
      // Else select all projects.
      fetch("/api/projects")
        .then(res => res.json())
        .then(projects => this.setState({ projects }));
      msg = "List of projects for all organizations";
    }
  }

  // Using technique described here, https://tylermcginnis.com/react-router-programmatically-navigate/.
  handleClick = (event, id) => {};

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
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
                  <div className={classes.box}>
                    <Table>
                      <TableRow>
                        <TableCell>
                          <Typography color="secondary" gutterBottom>
                            Projects listed for ${}.
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
                  <div className={classes.tableWrapper}>
                    <Typography variant="body1" gutterBottom>
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
                                <TableCell align="left">

                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Typography>
                  </div>
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
