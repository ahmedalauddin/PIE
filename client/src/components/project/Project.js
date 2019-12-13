/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/project/Project.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-06-17
 * Editor:   Brad Kaufman
 * Notes:    Uses Material UI controls, including simple select, see https://material-ui.com/demos/selects/.
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import { Link, Redirect } from "react-router-dom";
import { getOrgId, getOrgName, getOrgDepartments } from "../../redux";
import "../../stylesheets/Draft.css";
import ProjectPersons from "./ProjectPersons";
import ProjectDetail from "./ProjectDetail";
import Grid from "@material-ui/core/Grid";
import { red } from "@material-ui/core/colors";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Fab from "@material-ui/core/Fab";
import KpiTable from "../kpi/KpiTable";
import ActionTable from "./ActionTable";
import MilestoneList from "./MilestoneList";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import { styles } from "../styles/ProjectStyles";
import Gantt from "../gantt/Gantt";

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};


function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

class Project extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.setOrganizationInfo = this.setOrganizationInfo.bind(this);
    this.state = {
      project: {},
      organizations: [],
      departments: [],
      projid: 0,
      title: "",
      businessGoal: "",
      org: "",
      orgId: "",
      orgName: "",
      description: "",
      value: 0,
      hasError: "",
      expanded: null,
      openSnackbar: false,
      snackbarMessage: "",
      message: ""
    };
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  setOrganizationInfo = () => {
    // Get the organization from the filter.
    let orgName = getOrgName();
    let orgId = getOrgId();
    let departments = getOrgDepartments();

    this.setState({
      orgName: orgName,
      orgId: orgId,
      departments: departments
    });
  };

  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };

  componentDidMount() {
    this.setOrganizationInfo();
    let message = "";
    if (this.props.location.state && this.props.location.state.message)  {
      message = this.props.location.state.message;
      this.setState({
        openSnackbar: true,
        message: message
      });
    }
  }

  componentDidCatch() {
    return <Redirect to="/Login" />;
  }

  showMessages = (message) => {
    this.setState( {
      openSnackbar: true,
      message: message
    });
  };

  /* milestone actions

                    <Fab component={Link} size="small" color="primary" aria-label="Add"
                    to={{pathname: "/milestone", state: {projectId: projId} }}
                    className={classes.fab}>
                    <AddIcon />
                  </Fab>
                  <MilestoneList projectId={projId}/>

   */
  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;
    const { expanded } = this.state;
    let projId = this.props.match.params.id;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
        <div className={classes.root}>
          <Grid container alignItems="center" justify="center" spacing={24} lg={12}>
            <Grid item lg={10}>
              <Paper className={classes.paper}>
                <Typography
                  color="secondary"
                  gutterBottom
                >
                  Project Detail
                </Typography>
                <Typography variant="h7">
                  Organization: {getOrgName()}
                </Typography>
                <ProjectDetail projectId={projId} messages={this.showMessages}/>
              </Paper>
            </Grid>
            <Grid item lg={10}>
              <ExpansionPanel expanded={expanded === "panelKpis"} onChange={this.handlePanelChange("panelKpis")}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>KPIs</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container>
                    <Grid item lg={10}>
                      <Button variant="contained" color="primary" className={classes.button} component={Link} size="small"
                        aria-label="Add" to={{pathname: "/kpi", state: {projectId: projId} }} >
                        Add New
                        <AddIcon className={classes.rightIcon} />
                      </Button>
                      <Button variant="contained" color="primary" className={classes.button} component={Link} size="small"
                        aria-label="Search KPIs" to={{pathname: "/kpisearch", state: {projectId: projId} }} >
                        Search and Assign
                        <SearchIcon className={classes.rightIcon} />
                      </Button>
                      <KpiTable projectId={projId}/>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel expanded={expanded === "panelMilestones"} onChange={this.handlePanelChange("panelMilestones")}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>Milestones and Actions</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div className="gantt-container">
                    <Gantt projectId={projId} messages={this.showMessages}/>
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel expanded={expanded === "panelPersons"} onChange={this.handlePanelChange("panelPersons")}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>People</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container>
                    <Grid item lg={10}>
                      <Typography className={classes.secondaryHeading}>
                        Select owners and people assigned to the project
                      </Typography>
                      <Fab component={Link} size="small" color="primary" aria-label="Add"
                        to={{pathname: "/person", state: {projectId: projId} }}
                        className={classes.fab}>
                        <AddIcon />
                      </Fab>
                      <ProjectPersons projectId={projId} />
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>
        </div>
        <Snackbar
          open={this.state.openSnackbar}
          onClose={this.handleClose}
          TransitionComponent={this.state.Transition}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Project);
