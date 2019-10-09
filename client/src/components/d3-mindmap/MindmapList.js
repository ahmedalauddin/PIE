/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/MindmapList.js
 * Created:  2019-10-01
 * Desc:     List of mind maps for an organization.  Used to select which one to edit.
 * Author:   Brad Kaufman
 *
 * Modified: 2019-10-02
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/index";
import { Link, Redirect } from "react-router-dom";
import moment from "moment/moment";
import Fab from "@material-ui/core/Fab/index";
import AddIcon from "@material-ui/icons/Add";
import { getOrgId, getOrgName } from "../../redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import TablePagination from "@material-ui/core/TablePagination";
import PropTypes from "prop-types";
import EnhancedTableHead from "../common/EnhancedTableHead";
import { stableSort, getSorting, desc } from "../common/TableFunctions";
import DeleteIcon from "@material-ui/icons/Delete";
import SectionHeader from "../typo/SectionHeader";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const rows = [
  { id: "edit", numeric: false, disablePadding: false, label: "" },
  { id: "title", numeric: false, disablePadding: false, label: "Title" },
  { id: "description", numeric: false, disablePadding: false, label: "Description" },
  { id: "createdAt", numeric: false, disablePadding: false, label: "Created" },
  { id: "updatedAt", numeric: false, disablePadding: true, label: "Updated" }
];


function formatDate(dateInput) {
  let dateOut = "";

  if (dateInput !== null) {
    dateOut = moment(dateInput).format("YYYY-MM-DD");
  }
  return dateOut;
}

function handleNull(refToParse) {
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

const styles = theme => ({
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
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "15%",
  },
  wideColumn: {
    flexBasis: "35%",
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  }
});

class MindmapList extends Component {
  constructor(props) {
    super(props);
    this.addMindmap = this.addMindmap.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setEditRedirect = this.setEditRedirect.bind(this);
    this.renderEditRedirect = this.renderEditRedirect.bind(this);
  };

  state = {
    order: "asc",
    orderBy: "",
    orgId: getOrgId(),
    orgName: getOrgName(),
    selected: [],
    readyToEdit: false,
    submitted: null,
    page: 0,
    rowsPerPage: 5,
    mindmaps: [],
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
    fetch("/api/mindmaps-list/" + getOrgId())
      .then(res => {
        return res.json();
      })
      .then(mindmaps => {
        this.setState({
          mindmaps: mindmaps
        });
      });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  deactivateMindmap(id) {
    setTimeout(() => {
      if (id > 0) {
        // Deactivate a mind map
        let removePath = "/api/mindmaps-deactivate/" + id;
        fetch(removePath, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(data => {
            this.setState({ msg: "KPI updated." });
          })
          .catch(err => {
            this.setState({ msg: "Error occurred." });
          });
      }
    }, 2000);
  }

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  addMindmap = () => {
    return <Redirect to="/mindmap" />;
  };


  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  setEditRedirect = (mindmapId) => {
    this.setState({
      readyToEdit: true,
      mindmapId: mindmapId
    });
  }

  // Redirect to Mindmap.
  renderEditRedirect = () => {
    if (this.state.readyToEdit) {
      return <Redirect to={`/mindmap/${this.state.mindmapId}`} />;
    }
  };

  render() {
    const { classes } = this.props;
    const { mindmaps, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, mindmaps.length - page * rowsPerPage);
    const currentPath = this.props.location.pathname;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
        <div className={classes.root}>
          {this.renderEditRedirect()}
          <Grid container lg={10} direction="row" justify="center" alignSelf="end" alignItems="flex-end">
            <Grid item>
              <Card className={classes.card}>
                <CardContent>
                  <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                      <EnhancedTableHead
                        numSelected={selected.length}
                        rows={rows}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={this.handleRequestSort}
                        rowCount={mindmaps.length}
                      />
                      <TableBody>
                        {stableSort(mindmaps, getSorting(order, orderBy))
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map(mindmap => {
                            const isSelected = this.isSelected(mindmap.id);
                            return (
                              <TableRow
                                hover
                                aria-checked={isSelected}
                                tabIndex={-1}
                                key={mindmap.id}
                                selected={isSelected}
                              >
                                <TableCell component="th" scope="row" padding="none">
                                  <IconButton
                                    onClick={() => {
                                      this.setEditRedirect(mindmap.id);
                                    }}
                                  >
                                    <EditIcon color="primary" />
                                  </IconButton>
                                </TableCell>
                                <TableCell align="left">{mindmap.mapName}</TableCell>
                                <TableCell align="left">{mindmap.mapDescription}</TableCell>
                                <TableCell align="left">{formatDate(mindmap.createdAt)}</TableCell>
                                <TableCell align="left">{formatDate(mindmap.updatedAt)}</TableCell>
                                <TableCell padding="none">
                                  <IconButton
                                    onClick={() => {
                                      this.deactivateKpi(mindmap.id);
                                    }}
                                  >
                                    <DeleteIcon color="primary" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 49 * emptyRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={mindmaps.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                      "aria-label": "Previous Page"
                    }}
                    nextIconButtonProps={{
                      "aria-label": "Next Page"
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                  <br/>
                  <br/>
                  <Fab component={Link} color="primary" aria-label="Add" to={`/mindmap`} className={classes.fab}>
                    <AddIcon />
                  </Fab>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(MindmapList);
