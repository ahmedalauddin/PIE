/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ProjectPersons.js
 * Descr:    Allows selection of people assigned to a project.  SHould be a mixture of ValueInfinity
 *           personnel and client organization personnel.
 * Created:  2019-04-13
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-04-20
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
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import { Link, Redirect } from "react-router-dom";
import { styles } from "./styles/MaterialSense";
import { getOrgId } from "../redux";
import Button from "@material-ui/core/Button";

const rows = [
  { id: "assigned", numeric: false, disablePadding: false, label: "Assigned" },
  { id: "owner", numeric: false, disablePadding: false, label: "Owner" },
  { id: "person", numeric: false, disablePadding: true, label: "Person" },
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

class ProjectPersons extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleOwnerToggle = this.handleOwnerToggle.bind(this);
  }

  state = {
    order: "asc",
    orderBy: "",
    orgId: 0,
    checked: [0],
    orgPersons: [],
    projectPersons: [],
    projectName: "",
    hasError: "",
    selected: [],
    persons: []
  };

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  handleToggle = value => () => {
    const { orgPersons } = this.state;
    const idArray = orgPersons.map(p=>{return(p.id);});
    const currentIndex = idArray.indexOf(parseInt(value));
    orgPersons[currentIndex].inProject = !orgPersons[currentIndex].inProject;

    this.setState({
      orgPersons: orgPersons,
    });
  };

  handleOwnerToggle = value => () => {
    const { orgPersons } = this.state;
    const idArray = orgPersons.map(p=>{return(p.id);});
    // get the ID from the name of the checkbox, which is something like "own23".
    const personId = value.substring(3);
    const currentIndex = idArray.indexOf(parseInt(personId));
    orgPersons[currentIndex].owner = !orgPersons[currentIndex].owner;

    this.setState({
      orgPersons: orgPersons,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let projectId = this.props.match.params.id;

    setTimeout(() => {
      if (projectId > 0) {
        let updatePath = "/api/projectpersons/" + projectId;
        fetch(updatePath, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(data => {
            this.setState({ msg: "Project updated." });
          })
          .catch(err => {
            this.setState({ msg: "Error occurred." });
          });
      }
    }, 2000);
  }

  componentDidMount() {
    let projectId = this.props.match.params.id;
    let orgId = getOrgId();

    if (parseInt(projectId) > 0) {
      // First use the api/persons/project to get the team associated with the project
      // and all people who are part of the organization.
      fetch("/api/project-persons/" + projectId)
        .then(res => res.json())
        .then(persons => {
          this.setState({
            orgPersons: persons
          });
        })
        .catch(err => {
          this.setState({ hasError: true });
        });
    }
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
                      <Typography variant="body1" gutterBottom>
                        <div className={classes.tableWrapper}>
                          <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                          >
                            <MyTableHead />
                            <TableBody>
                              {this.state.orgPersons.map((person) => {
                                return (
                                  <TableRow
                                    hover
                                    onClick={event => {}}
                                    tabIndex={-1}
                                    key={person.id}
                                  >
                                    <TableCell align="left" width="15%">
                                      <Checkbox
                                        key={person.id}
                                        checked={!!+person.inProject}
                                        tabIndex={-1}
                                        onChange={this.handleToggle(person.id)}
                                      />
                                    </TableCell>
                                    <TableCell align="left" width="15%">
                                      <Checkbox
                                        key={"own" + person.id}
                                        checked={!!+person.owner}
                                        tabIndex={-1}
                                        onChange={this.handleOwnerToggle("own" + person.id)}
                                      />
                                    </TableCell>
                                    <TableCell align="left">
                                      <strong>{person.lastName}, {person.firstName}<br/></strong>
                                      {person.email}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </Typography>
                    </div>
                    <div className={classes.spaceTop}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                        className={classes.secondary}
                      >
                        Update
                      </Button>
                    </div>
                    <br />
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
