// List for editing projects, 1/22/19.
// Will be removed eventually.  Essentially a test harness for EditProject.
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
    const {
      order,
      orderBy
    } = this.props;

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

class ListProjects extends Component {
  constructor() {
    super();
  }

  state = {
    order: "asc",
    orderBy: "",
    selected: [],
    projects: [],
    toProject: "false",
    toProjectId: ""
  };

  componentDidMount() {
    fetch("/api/projects")
      .then(res => res.json())
      .then(projects => this.setState({ projects }));
  }

  // Here I just want to use something like the construct in Topbar to navigate
  // via client/routes.js.
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
                  <Paper className={classes.paper}>
                    <div className={classes.box}>
                      <Typography color="secondary" gutterBottom>
                        Full list of all ValueInfinity projects
                      </Typography>
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
                                      <TableCell align="left">
                                        {project.organization.name}
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
