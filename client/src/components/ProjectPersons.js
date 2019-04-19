/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ProjectPersons.js
 * Descr:    Allows selection of people assigned to a project.  SHould be a mixture of ValueInfinity
 *           personnel and client organization personnel.
 * Created:  2019-04-13
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
import Checkbox from "@material-ui/core/Checkbox";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { Link, Redirect } from "react-router-dom";
import { styles } from "./styles/MaterialSense";
import { getOrgId, getOrgName, getOrgDepartments } from "../redux";

const rows = [
  { id: "select", numeric: false, disablePadding: false, label: "Selected" },
  { id: "firstName", numeric: false, disablePadding: true, label: "First name" },
  { id: "lastName", numeric: false, disablePadding: true, label: "Last name" },
  { id: "email", numeric: false, disablePadding: false, label: "Email address" }
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
                {row.label}
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}

var getProjectData = (projectId) => {
  let fetchUrl = "/api/projects/" + projectId;
  fetch(fetchUrl).then(function(response) {
    return response.json();
  });
}

var getOrganizationData = (orgId) => {
  let fetchUrl = "/api/organizations/" + orgId;
  fetch(fetchUrl).then(function(response) {
    return response.json();
  });
}

class ProjectPersons extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    //this.getProjectData = this.getProjectData.bind(this);
    //this.getOrganizationData = this.getOrganizationData.bind(this);
  }

  state = {
    order: "asc",
    orderBy: "",
    orgId: 0,
    checked: [],
    orgPersons: [],
    team: [],
    projectPersons: [],
    projectName: "",
    hasError: "",
    selected: [],
    persons: []
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };



  componentDidMount() {
    let projectId = this.props.match.params.id;
    let orgId = getOrgId();

    if (parseInt(projectId) > 0) {
      Promise.all([getProjectData(projectId), getOrganizationData(orgId)])
        .then(values => {
          let projectData = values[0];
          let orgData = values[1];
          this.setState({
            orgPersons: orgData.persons,
            orgId: orgId,
            projId: projectId,
            projectName: projectData.name,
            team: projectData.team
          });
        })
        .catch(err => {
          this.setState({hasError: true});
        });
    }
/*
      // First use the api/projects to get the team associated with the project
      fetch("/api/projects/" + projectId)
        .then(res => res.json())
        .then(project => {
          orgId = project.organization.id;
          team = project.team;
          projName = project.name;
        })
        .catch(err => {
          this.setState({hasError: true});
        });

      // Now use the organizations api to get the list of all people associated
      // with the client organization.
      fetch("/api/organizations/" + orgId)
        .then(res => res.json())
        .then(organization => {
          this.setState({
            orgPersons: organization.persons,
            orgId: orgId,
            projId: projectId,
            projectName: projName,
            team: team
          });
        })
        .catch(err => {
          this.setState({hasError: true});
        });
    }*/
  }

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

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
                  <Paper className={classes.paper}>
                    <div className={classes.box}>
                      <Typography color="secondary" gutterBottom>
                        Select people assigned to project: {this.state.projectName}
                      </Typography>
                    </div>
                    <div>
                      <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                      >
                        <MyTableHead />
                        <TableBody>
                          {this.state.orgPersons.map(function(person, i){
                            return (
                              <TableRow
                                hover
                                onClick={event => {}}
                                tabIndex={-1}
                                key={person.id}
                              >
                                <TableCell align="left">
                                  <Checkbox
                                    checked={this.state.checked[i]}
                                    onChange=""
                                    value={this.state.checked[i]}
                                    color="primary"
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  {person.firstName}
                                </TableCell>
                                <TableCell align="left">
                                  {person.lastName}
                                </TableCell>
                                <TableCell align="left">
                                  <Link to={`/editperson/${person.id}`}>
                                    {person.email}
                                  </Link>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
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

export default withStyles(styles)(ProjectPersons);
