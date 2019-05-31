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
import Typography from "@material-ui/core/Typography/index";
import { Link, Redirect } from "react-router-dom";
import { getOrgId, getOrgName } from "../../redux";
import moment from "moment/moment";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/index";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/index";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/index";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/index";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Fab from "@material-ui/core/Fab/index";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const statuses = [
  "Pending",
  "In Progress",
  "Completed"
];

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

const styles = theme => ({
  chip: {
    margin: 2,
  },
  filterSelect: {
    alignItems: "baseline",
  },
  filters: {
    alignItems: "baseline",
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3,
  },
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
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 150,
    maxWidth: 400,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "15%",
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  }
});

var msg = "";

class PanelDashboard extends Component {
  constructor(props) {
    super(props);
    this.handleNull = this.handleNull.bind(this);
    this.addProject = this.addProject.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  };

  state = {
    order: "asc",
    orderBy: "",
    orgId: "",
    organization:"",
    orgName: "",
    selected: [],
    selectedYrs: [],
    projects: [],
    yearList: [],
    status: [],
    projectYear: [],
    readyToRedirect: false,
    selectChips: null,
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
            orgName: orgName,
            orgId: orgId
          });
        });
    }

    // Get list of years for filtering.
    fetch("/api/projects-years/" + orgId)
      .then(res => {
        return res.json();
      })
      .then(years => {
        let beginYear = years[0].beginYear;
        let endYear = years[0].endYear;
        let yearList = [];
        let i = 0;
        for (var yr=beginYear; yr <= endYear; yr++) {
          yearList[i] = yr;
          i++;
        }
        this.setState({
          yearList: yearList,
        });
      });
  };

  formatDate(dateInput) {
    let dateOut = "";

    if (dateInput !== null) {
      dateOut = moment(dateInput).format("YYYY-MM-DD");
    }
    return dateOut;
  }

  handleClick = (event, id) => {};

  addProject = () => {
    return <Redirect to="/newproject" />;
  };

  handleChange = event => {
    this.setState({ status: event.target.value });
  };

  handleYearChange = event => {
    this.setState({ projectYear: event.target.value });
  };

  handleUpdate = (event) => {
    event.preventDefault();
    setTimeout(() => {
      fetch("/api/projects-filtered", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then(res => {
          return res.json();
        })
        .then(projects => {
          this.setState({
            projects: projects
          });
        });
    }, 2000);
  };

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
                  <div className={classes.root}>
                    <Typography
                      variant="subtitle1"
                      color="secondary"
                      gutterBottom
                    >
                      Projects listed for {getOrgName()}
                    </Typography>
                    <div className={classes.filters}>
                      <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="selectChips">Filter by status</InputLabel>
                        <Select
                          multiple
                          value={this.state.status}
                          onChange={this.handleChange}
                          input={<Input id="selectChips" />}
                          renderValue={selected => (
                            <div className={classes.chips}>
                              {selected.map(value =>
                                <Chip key={value} label={value} className={classes.chip} />
                                )}
                            </div>
                          )}
                          MenuProps={MenuProps}
                        >
                          {statuses.map(status => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="yearFilter">Filter by project year</InputLabel>
                        <Select
                          multiple
                          value={this.state.projectYear}
                          onChange={this.handleYearChange}
                          input={<Input id="yearFilter" />}
                          renderValue={selectedYrs => (
                            <div className={classes.chips}>
                              {selectedYrs.map(value =>
                                <Chip key={value} label={value} className={classes.chip} />
                              )}
                            </div>
                          )}
                          MenuProps={MenuProps}
                        >
                          {this.state.yearList.map(year => (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        color="primary"
                        vertical-align="bottom"
                        onClick={this.handleUpdate}
                        className={classes.secondary}
                      >
                        Update Results
                      </Button>
                    </div>
                    <ExpansionPanel expanded={false}>
                      <ExpansionPanelSummary>
                        <div className={classes.column}>
                          <Typography className={classes.heading}>
                            Project title
                          </Typography>
                        </div>
                        <div className={classes.column}>
                          <Typography className={classes.secondaryHeading}>
                            Status
                          </Typography>
                        </div>
                        <div className={classes.column}>
                          <Typography className={classes.secondaryHeading}>
                            Targeted KPI
                          </Typography>
                        </div>
                        <div className={classes.column}>
                          <Typography className={classes.secondaryHeading}>
                            Start date
                          </Typography>
                        </div>
                        <div className={classes.column}>
                          <Typography className={classes.secondaryHeading}>
                            End date
                          </Typography>
                        </div>
                      </ExpansionPanelSummary>
                    </ExpansionPanel>
                    {this.state.projects.map(project => {
                      return (
                        <ExpansionPanel key={project.id}>
                          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <div className={classes.column}>
                              <Typography className={classes.heading}>
                                <Link to={`/project/${project.id}`}>
                                  {project.projectTitle}
                                </Link>
                              </Typography>
                            </div>
                            <div className={classes.column}>
                              <Typography className={classes.secondaryHeading}>
                                {project.status}
                              </Typography>
                            </div>
                            <div className={classes.column}>
                              <Typography className={classes.secondaryHeading}>
                                {project.mainKpi}
                              </Typography>
                            </div>
                            <div className={classes.column}>
                              <Typography className={classes.secondaryHeading}>
                                {this.formatDate(project.startAt)}
                              </Typography>
                            </div>
                            <div className={classes.column}>
                              <Typography className={classes.secondaryHeading}>
                                {this.formatDate(project.endAt)}
                              </Typography>
                            </div>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails className={classes.details}>
                            <div>
                              <Typography className={classes.secondaryHeading}>
                                Owners: {project.owners}<br/>
                                Tasks: {project.tasks}
                              </Typography>
                            </div>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      );
                    })}
                    <br/>
                    <br/>
                    <Fab component={Link} color="primary" aria-label="Add" to={`/project`} className={classes.fab}>
                      <AddIcon />
                    </Fab>
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

export default withStyles(styles)(PanelDashboard);
