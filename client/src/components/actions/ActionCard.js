/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ProjectCard.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-05-02
 * Editor:   Brad Kaufman
 * Notes:    Uses Material UI controls, including simple select, see https://material-ui.com/demos/selects/.
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Typography from "@material-ui/core/Typography/index";
import Topbar from "../Topbar";
import { styles } from "../styles/MaterialSense";
import Grid from "@material-ui/core/Grid/index";
import SectionHeader from "../typo/SectionHeader";
import TextField from "@material-ui/core/TextField/index";
import Paper from "@material-ui/core/Paper/index";
import Button from "@material-ui/core/Button/index";
import { getOrgId, getOrgName } from "../../redux";
import FormControl from "@material-ui/core/FormControl/index";
import MenuItem from "@material-ui/core/MenuItem/index";
import InputLabel from "@material-ui/core/InputLabel/index";
import Select from "@material-ui/core/Select/index";
import Card from "@material-ui/core/Card/index";
import CardContent from "@material-ui/core/CardContent/index";

class ActionCard extends React.Component {
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
    task: {},
    projectId: 0,
    projectName: "",
    title: "",
    type: "",
    org: "",
    orgId: "",
    orgName: "",
    assigned: null,
    assignedList: [],
    milestone: null,
    milestoneList: [],
    priority: null,
    priorityList: [],
    description: "",
    msg: "",
    buttonText: "",
    isEditing: false,
    redirect: false,
    isNew: false,
    expanded: false,
    labelWidth: 0
  };

  setOrganizationInfo = () => {
    // Get the organization from the filter.
    let orgName = getOrgName();
    let orgId = getOrgId();

    this.setState({
      orgName: orgName,
      orgId: orgId
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  //handleSubmit(values, {resetForm, setErrors, setSubmitting}) {
  handleSubmit(event) {
    event.preventDefault();
    // Project ID and task id (if there is the latter, are passed in by location.state.
    const projectId = this.props.location.state.projectId;
    const taskId = this.props.location.state.actionId;

    setTimeout(() => {
      if (this.state.id > 0) {
        let updatePath = "/api/tasks/" + taskId;
        fetch(updatePath, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(response => {
            if (response.status.toString().localeCompare("201")) {
              this.setState({ msg: "Action item updated" });
            }
          })
          .catch(err => {
            //console.log(err);
          });
      } else {
        // No project id, so we will do a create.  The difference
        // is we do a POST instead of a PUT.
        fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(data => {
            // Redirect to the Project component.
            // TODO - pass a message to Project indicating the action creation
            // was successful.
            this.props.history.push(`/project/${projectId}`);
          })
          .catch(err => {
            //console.log(err);
          });
      }
    }, 2000);
  }

  componentDidMount() {
    this.setOrganizationInfo();
    // Project ID and task id (if there is the latter, are passed in by location.state.
    const projectId = this.props.location.state.projectId;
    const taskId = this.props.location.state.actionId;

    // Use the project to get the assigned to list.
    if (parseInt(projectId) > 0) {
      fetch(`/api/projects/${projectId}`)
        .then(res => res.json())
        .then(project => {
          this.setState({
            assignedList: project.team,
            projectName: project.title,
            milestoneList: project.milestones
          });
        });
    }

    fetch(`/api/taskpriorities`)
      .then(res => res.json())
      .then(priorities => {
        this.setState({
          priorityList: priorities
        });
      });

    if (parseInt(taskId) > 0) {
      fetch(`/api/tasks/${taskId}`)
        .then(res => res.json())
        .then(task => {
          this.setState({
            id: taskId,
            title: task.title,
            description: task.description,
            assigned: task.assigned.fullName,
            orgId: task.orgId,
            projectId: task.projectId,
            buttonText: "Update"
          });
        });
    } else {
      this.setState({
        isEditing: true,
        projectId: projectId,
        buttonText: "Create"
      });
    }
  }

  render() {
    const { classes } = this.props;
    const projectId = this.props.location.state.projectId;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div className={classes.root}>
          <Grid container alignItems="center" justify="center" spacing={24} lg={12}>
            <Grid item lg={10}>
              <Paper className={classes.paper}>
                <form onSubmit={this.handleSubmit} noValidate>
                  <Typography
                    variant="h7"
                    color="secondary"
                    gutterBottom
                  >
                    Action Detail<br/>
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
                      <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="assigned-simple">
                          Priority
                        </InputLabel>
                        <Select
                          value={this.state.priority}
                          onChange={this.handleSelectChange}
                          inputProps={{
                            name: "priority",
                            id: "priority-simple"
                          }}
                        >
                          {this.state.priorityList.map(priority => {
                            return (
                              <MenuItem key={priority.id} value={priority.id}>
                                {priority.label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="assigned-simple">
                          Assigned To
                        </InputLabel>
                        <Select
                          value={this.state.assigned}
                          onChange={this.handleSelectChange}
                          inputProps={{
                            name: "assigned",
                            id: "assigned-simple"
                          }}
                        >
                          {this.state.assignedList.map(person => {
                            return (
                              <MenuItem key={person.id} value={person.id}>
                                {person.fullName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <br />
                      <br />
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="milestone-simple">
                          Milestone
                        </InputLabel>
                        <Select
                          value={this.state.milestone}
                          onChange={this.handleSelectChange}
                          inputProps={{
                            name: "milestone",
                            id: "milestone-simple"
                          }}
                        >
                          {this.state.milestoneList.map(milestone => {
                            return (
                              <MenuItem key={milestone.id} value={milestone.id}>
                                {milestone.title}: target date {milestone.targetDate}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <br />
                      <br />
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                        className={classes.secondary}
                      >
                        {this.state.buttonText}
                      </Button>
                      <br />
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

export default withStyles(styles)(ActionCard);
