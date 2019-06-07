/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ProjectPanelList.js
 * Descr:    Lists projects for an organization using expansion panels.
 * Created:  2019-06-02
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-06-02
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/index";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography/index";
import { Link, Redirect } from "react-router-dom";
import { getOrgId, getProjectFilter } from "../../redux";
import moment from "moment/moment";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/index";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/index";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/index";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Fab from "@material-ui/core/Fab/index";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import { connect } from "react-redux";

const styles = theme => ({
  chip: {
    margin: 2,
  },
  filterSelect: {
    alignItems: "flex-end",
  },
  filters: {
    alignItems: "flex-end",
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
    minWidth: 170,
    maxWidth: 450,
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
  narrowColumn: {
    flexBasis: "5%",
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

class ProjectPanelList extends Component {
  constructor(props) {
    super(props);
    this.addProject = this.addProject.bind(this);
    this.fetchProjects = this.fetchProjects.bind(this);
  };

  state = {
    order: "asc",
    orderBy: "",
    orgId: "",
    organization:"",
    orgName: "",
    projects: [],
    projectId: null,
    readyToEdit: false,
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

  fetchProjects = () => {
    let orgId = getOrgId();
    let statusFilter = this.props.projectListFilter.status;
    let startYearFilter = this.props.projectListFilter.startYear;
    let endYearFilter = this.props.projectListFilter.endYear;

    if (parseInt(orgId) > 0) {
      console.log("ProjectPanelList, before setState for filter values");
      // Use the props for the body of the fetch request.
      const reqBody = {statusFilter, startYearFilter, endYearFilter, orgId};

      fetch("/api/projects-filtered", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(reqBody)
      })
        .then(res => {
          console.log("ProjectPanelList, after fetch");
          return res.json();
        })
        .then(projects => {
          this.setState({
            projects: projects
          });
          console.log("fetch: complete");
        });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.projectListFilter !== prevProps.projectListFilter) {
      this.fetchProjects();
    }
  };

  componentDidMount() {
    console.log("componentDidMount this.props: " + JSON.stringify(this.props));
    this.fetchProjects();
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

  setEditRedirect = (projectId) => {
    this.setState({
      readyToEdit: true,
      projectId: projectId
    });
  }

  renderEditRedirect = () => {
    if (this.state.readyToEdit) {
      return <Redirect to={`/project/${this.state.projectId}`} />;
    }
  }

  render() {
    const { classes } = this.props;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (
      <React.Fragment>
        <Grid container lg={10} justify="center">
          <Grid lg={10} item>
            <ExpansionPanel expanded={false}>
              <ExpansionPanelSummary>
                <div className={classes.narrowColumn}>
                </div>
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
                    <div className={classes.narrowColumn}>
                      <IconButton onClick={() => {this.setEditRedirect(project.id);}}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </div>
                    <div className={classes.column}>
                      <Typography className={classes.heading}>
                        {project.projectTitle}
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
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    projectListFilter: state.projectListFilter
  };
};

export default withStyles(styles)(connect(mapStateToProps)(ProjectPanelList));
