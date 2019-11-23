/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/project/ProjectDetail.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-04-29
 * Editor:   Brad Kaufman
 * Notes:    Uses Material UI controls, including simple select, see https://material-ui.com/demos/selects/.
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import { styles } from "../styles/MaterialSense";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Redirect } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { getOrgId, getOrgName, getOrgDepartments, setProject, store, setOrg } from "../../redux";

class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKpiSelectChange = this.handleKpiSelectChange.bind(this);
    this.setOrganizationInfo = this.setOrganizationInfo.bind(this);
    this.onChange = editorState => this.setState({ editorState });
  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
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
    summary: "",
    mainKpiId: null,
    hasError: "",
    kpis: [],
    startAt: "",
    endAt: "",
    progress: 0,
    message: "",
    buttonText: "Create",
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
    let departments = getOrgDepartments();

    this.setState({
      orgName: orgName,
      orgId: orgId,
      departments: departments
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleKpiSelectChange = event => {
    this.setState({ mainKpiId: event.target.value });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  anotherFunction = () => {
    this.props.showMessages(this.state.message);
  };

  handleSubmit(event) {
    event.preventDefault();
    let projectId = parseInt(this.state.id);
    let apiPath = "";
    let successMessage = "";
    let method = "";

    if (projectId > 0) {
      // For updates - use PUT
      apiPath = "/api/projects/" + projectId;
      successMessage = "Project updated."
      method = "PUT";
    } else {
      // For create
      apiPath = "/api/projects/";
      successMessage = "Project created."
      method = "POST";
    }

    setTimeout(() => {
      fetch(apiPath, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then( () => {
          console.log("Going to log message: " + successMessage);
          this.props.messages(successMessage);
        })
        .catch(err => {
          this.setState({ message: "Error occurred." });
        });
    }, 2000);
  }

  componentDidMount() {
    this.setOrganizationInfo();
    let projectid = parseInt(this.props.projectId);

    if (projectid > 0) {
      fetch(`/api/projects/${projectid}`)
        .then(res => res.json())
        .then(project => {
          this.setState({
            id: projectid,
            businessGoal: project.businessGoal,
            title: project.title,
            description: project.description,
            org: project.organization.name,
            orgId: project.orgId,
            summary: project.summary,
            mainKpiId: project.mainKpiId,
            kpis: project.kpis,
            progress: project.progress,
            startAt: moment(project.startAt).format("YYYY-MM-DD"),
            endAt: moment(project.endAt).format("YYYY-MM-DD"),
            buttonText: "Update"
          });
          return project;
        })
        .then(project => {
          store.dispatch(setProject(JSON.stringify(project)));
          console.log("ProjectDetail.js, project:" + JSON.stringify(project));
        });
    } else {
      this.setState({
        isEditing: true,
        buttonText: "Create"
      });
    }
    // Have to set the state of the individual fields for the handleChange function for the TextFields.
    // Do this using the project state.
  }

  componentDidCatch() {
    return <Redirect to="/Login" />;
  }

  render() {
    const { classes } = this.props;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    // this.props.messages("Entering project detail component");

    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <Typography color="secondary" gutterBottom>
          {this.state.message}
        </Typography>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <TextField
              required
              id="title-required"
              label="Project Title"
              onChange={this.handleChange("title")}
              value={this.state.title}
              fullWidth
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
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="summary"
              label="Summary"
              multiline
              rowsMax="8"
              value={this.state.summary}
              onChange={this.handleChange("summary")}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="businessGoal"
              label="Business Goal"
              multiline
              rowsMax="4"
              value={this.state.businessGoal}
              onChange={this.handleChange("businessGoal")}
              fullWidth
              className={classes.textFieldWide}
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink htmlFor="kpi-simple">Main KPI</InputLabel>
              <Select
                value={this.state.mainKpiId}
                onChange={this.handleKpiSelectChange}
                inputProps={{
                  name: "mainKpiId",
                  id: "mainKpiId"
                }}
              >
                {this.state.kpis.map(kpi => {
                  return (
                    <MenuItem key={kpi.id} value={kpi.id}>
                      {kpi.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="startAt"
              label="Start Date"
              type="date"
              value={this.state.startAt}
              onChange={this.handleChange("startAt")}
              className={classes.textFieldWide}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="standard-required"
              label="Progress"
              onChange={this.handleChange("progress")}
              value={this.state.progress}
              className={classes.textFieldWide}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    %
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="endAt"
              label="End Date"
              type="date"
              value={this.state.endAt}
              onChange={this.handleChange("endAt")}
              className={classes.textFieldWide}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
    );
  }
}

export default withStyles(styles)(ProjectDetail);
