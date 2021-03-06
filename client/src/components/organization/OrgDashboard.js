/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/organization/OrgDashboard.js
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
import moment from "moment/moment";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/index";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/index";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/index";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Fab from "@material-ui/core/Fab/index";
import AddIcon from "@material-ui/icons/Add";

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

var msg = "";

class OrgDashboard extends Component {
  constructor(props) {
    super(props);
    this.handleNull = this.handleNull.bind(this);
    this.addProject = this.addProject.bind(this);
  };

  state = {
    order: "asc",
    orderBy: "",
    orgId: "",
    organizations: [],
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
    fetch("/api/organizations-dashboard")
      .then(res => {
        return res.json();
      })
      .then(organizations => {
        this.setState({
          organizations: organizations
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
                      All clients and projects for ValueInfinity
                    </Typography>
                    <ExpansionPanel expanded={false}>
                      <ExpansionPanelSummary>
                        <div className={classes.column}>
                          <Typography className={classes.heading}>
                            Client organization
                          </Typography>
                        </div>
                        <div className={classes.wideColumn}>
                          <Typography className={classes.secondaryHeading}>
                            Projects
                          </Typography>
                        </div>
                        <div className={classes.wideColumn}>
                          <Typography className={classes.secondaryHeading}>
                            KPIs
                          </Typography>
                        </div>
                      </ExpansionPanelSummary>
                    </ExpansionPanel>
                    {this.state.organizations.map(organization => {
                      return (
                        <ExpansionPanel key={organization.id}>
                          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <div className={classes.column}>
                              <Typography className={classes.heading}>
                                <Link to={`/organization/${organization.id}`}>
                                  {organization.name}
                                </Link>
                              </Typography>
                            </div>
                            <div className={classes.wideColumn}>
                              <Typography className={classes.secondaryHeading}>
                                {organization.projects}
                              </Typography>
                            </div>
                            <div className={classes.wideColumn}>
                              <Typography className={classes.secondaryHeading}>
                                {organization.kpis}
                              </Typography>
                            </div>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails className={classes.details}>
                            <div>
                              <Typography className={classes.secondaryHeading}>
                                Departments: {organization.departments}<br/>
                                People: {organization.people}
                              </Typography>
                            </div>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      );
                    })}
                    <br/>
                    <br/>
                    <Fab component={Link} color="primary" aria-label="Add" to={`/organization`} className={classes.fab}>
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

export default withStyles(styles)(OrgDashboard);
