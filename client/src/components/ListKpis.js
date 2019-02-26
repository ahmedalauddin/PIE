// List for editing KPIs, 1/22/19.
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
  { id: "title", numeric: false, disablePadding: true, label: "KPI" },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description"
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Type"
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

class ListKpis extends Component {
  constructor() {
    super();
  }

  state = {
    order: "asc",
    orderBy: "",
    selected: [],
    kpis: [],
    toProject: "false",
    toProjectId: ""
  };

  componentDidMount() {
    // ListKpis is expected to take a param of project ID, and fetch the KPIs
    // associated only with that project.
    alert('id: ' + this.props.match.params.id);
    fetch(`/api/kpis/project/${this.props.match.params.id}`)
      .then(res => res.json())
      .then(kpis => this.setState({ kpis }));
  }

  // Here I just want to use something like the construct in Topbar to navigate
  // via client/routes.js.
  // Using technique described here, https://tylermcginnis.com/react-router-programmatically-navigate/.
  handleClick = (event, id) => {};

  render() {
    const { classes } = this.props;

    /* react-router has injected the value of the attribute ID into the params */
    const id = this.props.match.params.id;

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
                        List of KPIs
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
                                  this.state.kpis,
                                  getSorting("asc", "title")
                                ).map(kpi => {
                                  return (
                                    <TableRow
                                      hover
                                      onClick={event => {
                                        this.handleClick(event, kpi.id);
                                      }}
                                      tabIndex={-1}
                                      key={kpi.id}
                                    >
                                      <TableCell width="25%" align="left">
                                        <Link to={`/kpicard/${kpi.id}`}>
                                          {kpi.title}
                                        </Link>
                                      </TableCell>
                                      <TableCell width="35%" align="left">
                                        {kpi.description}
                                      </TableCell>
                                      <TableCell width="15%" align="left">
                                        {kpi.type}
                                    </TableCell>
                                      <TableCell align="left">
                                        {kpi.organization.name}
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

export default withStyles(styles)(ListKpis);
