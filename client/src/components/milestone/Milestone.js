/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ProjectCard.js
 * Descr:    Project component.  Allows create and update.
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-05-02
 * Editor:   Brad Kaufman
 * Notes:    Uses Material UI controls, including simple select, see https://material-ui.com/demos/selects/.
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import { styles } from "../styles/MaterialSense";
import Card from "@material-ui/core/Card/index";
import CardContent from "@material-ui/core/CardContent/index";
import Grid from "@material-ui/core/Grid/index";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { getOrgId, getOrgName, getOrgDepartments } from "../../redux";
import { Redirect } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";
import "../styles/ReactTags.css";
import Paper from "@material-ui/core/Paper";
import ProjectDetail from "../project/ProjectDetail";

class Milestone extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.setOrganizationInfo = this.setOrganizationInfo.bind(this);
  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    project: {},
    projectId: 0,
    title: "",
    id: 0,
    description: "",
    orgId: 0,
    projectName: "",
    msg: "",
    buttonText: "Create",
    isEditing: false,
    redirect: false,
    isNew: false,
    expanded: false,
    statusList: [],
    hasError: false,
    labelWidth: 0,
    focus: false,
    nextItem: ""
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  handleSubmit(event) {
    event.preventDefault();
    // Project ID and KPI id (if there is the latter, are passed in by location.state.
    const projectId = this.props.location.state.projectId;
    const milestoneId = this.props.location.state.milestoneId;

    setTimeout(() => {
      if (milestoneId > 0) {
        let updatePath = "/api/milestones/" + milestoneId;
        fetch(updatePath, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(response => {
            if (response.status.toString().localeCompare("201")) {
              return <Redirect to={`/project/${projectId}`} />;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // No milestone id, so we will do a create.  The difference
        // is we do a POST instead of a PUT.
        fetch("/api/milestones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(response => {
            if (response.status.toString().localeCompare("201")) {
              return <Redirect to={`/project/${projectId}`} />;
            }
          })
          .then(() => {
            // Redirect to the Project component.
            // TODO - uncomment this
            // this.props.history.push(`/project/${projectId}`);
          })
          .catch(err => {
            //console.log(err);
          });
      }
      //setSubmitting(false);
    }, 2000);
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

  componentDidMount() {
    this.setOrganizationInfo();
    // Project ID and KPI id (if there is the latter, are passed in by location.state.
    const projectId = this.props.location.state.projectId;
    const milestoneId = this.props.location.state.milestoneId;

    if (parseInt(milestoneId) > 0) {
      fetch(`/api/milestones/${milestoneId}`)
        .then(res => res.json())
        .then(milestone => {
          this.setState({
            id: milestoneId,
            title: milestone.title,
            description: milestone.description,
            level: milestone.level,
            formula: milestone.formulaDescription,
            orgId: milestone.orgId,
            projectName: milestone.project.title,
            projectId: projectId,
            buttonText: "Update"
          });
          let x = 1;
        })
    } else {
      this.setState({
        isEditing: true,
        projectId: projectId,
        buttonText: "Create"
      });
    }
    // Have to set the state of the individual fields for the handleChange function for the TextFields.
    // Do this using the project state.

    fetch("/api/taskstatuses")
      .then(results => results.json())
      .then(statuses => this.setState({ statusList: statuses }));
  }

  render() {
    const { classes } = this.props;
    const { tags, suggestions } = this.state;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div className={classes.root}>
          <Grid container alignItems="center" justify="center" spacing={24} lg={12}>
            <Grid item lg={10}>
              <Paper className={classes.paper}>
                <form onSubmit={this.handleSubmit} noValidate>
                  <Grid container alignItems="center" justify="center" spacing={24} lg={12}>
                    <Grid item lg={10}>
                        <Typography
                          variant="h6"
                          color="secondary"
                          gutterBottom
                        >
                          Milestone Detail<br/>
                        </Typography>
                        <Typography variant="h7">
                          Project: {this.state.projectName}
                        </Typography>
                        <Typography variant="h7">
                          Organization: {getOrgName()}
                        </Typography>
                      <Grid container spacing={24}>
                        <Grid item xs={12}>
                          <TextField
                            required
                            id="title-required"
                            label="Title"
                            fullWidth
                            onChange={this.handleChange("title")}
                            value={this.state.title}
                            className={classes.textField}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            id="description"
                            label="Description"
                            multiline
                            rowsMax="6"
                            value={this.state.description}
                            onChange={this.handleChange("description")}
                            className={classes.textField}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            id="targetDate"
                            label="Target Date"
                            type="date"
                            value={this.state.targetDate}
                            onChange={this.handleChange("targetDate")}
                            className={classes.textFieldWide}
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="assigned-simple">
                              Status
                            </InputLabel>
                            <Select
                              value={this.state.status}
                              onChange={this.handleSelectChange}
                              inputProps={{
                                name: "status",
                                id: "status-simple"
                              }}
                            >
                              {this.state.statusList.map(status => {
                                return (
                                  <MenuItem key={status.id} value={status.id}>
                                    {status.label}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Typography component="p">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                            className={classes.secondary}
                          >
                            {this.state.buttonText}
                          </Button>
                        </Typography>
                        <br />
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Milestone);
