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
import Checkbox from "@material-ui/core/Checkbox";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { Link, Redirect } from "react-router-dom";
import { styles } from "./styles/MaterialSense";
import { getOrgId } from "../redux";

const rows = [
  { id: "assigned", numeric: false, disablePadding: false, label: "Assigned" },
  { id: "owner", numeric: false, disablePadding: false, label: "Owner" },
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

class ProjectPersons extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  state = {
    order: "asc",
    orderBy: "",
    orgId: 0,
    checked: [],
    orgPersons: [],
    projectPersons: [],
    projectName: "",
    hasError: "",
    selected: [],
    persons: []
  };

  handleChange = name => event => {
    /*this.setState({
    [name.checkname]: event.target.checked,
    [name.inProject]: !name.inProject
     }); */

    //[name].inProject = ![name].inProject;
    this.setState({
      [name.checkname.checked]: true,
      [name.inProject]: true
    });

    //this.name.checkname.checked = !name.checkname.checked;
  };


  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  handleClick = (person) => {
    /*
    const { id } = e.target;
    const {orgPersons} = this.state;
    orgPersons[id].inProject = !this.state.orgPersons[id].inProject;
    this.setState({ orgPersons }); */
    console.log(person);
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
                      <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                      >
                        <MyTableHead />
                        <TableBody>
                          {this.state.orgPersons.map((person, i) => {
                            return (
                              <TableRow
                                hover
                                onClick={event => {}}
                                tabIndex={-1}
                                key={person.id}
                              >
                                <TableCell align="left">
                                  <Checkbox
                                    checked={!!+person.inProject}
                                    value={person.checkName}
                                    onChange={this.handleChange(person)}
                                    color="primary"
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  <Checkbox
                                    checked={!!+person.owner}
                                    value={"owner-" + i}
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
