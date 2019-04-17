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

class ProjectPersons extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
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
    let orgId = 0;
    let team = [];
    let projName = "";

    if (parseInt(projectId) > 0) {
      this.setState({ projId: projectId });
      fetch("/api/projects/" + projectId)
        .then(res => res.json())
        .then(project => {
          orgId = project.organization.id;
          team = project.team;
          projName = project.name;
          return (fetch("/api/organizations/" + orgId));
        })
        .then(res => res.json())
        .then(organization => {
          this.setState({
            orgPersons: organization.persons,
            orgId: orgId,
            projectName: projName,
            team: team
          });
          let i = orgId;
        });
    }
  }

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
