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
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import SectionHeader from "../typo/SectionHeader";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Redirect } from "react-router-dom";
import CardToolbar from "../navigation/CardToolbar";
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
    mainKpiId: null,
    hasError: "",
    kpis: [],
    startAt: "",
    endAt: "",
    progress: 0,
    msg: "",
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

  handleSubmit(event) {
    event.preventDefault();

    setTimeout(() => {
      if (this.state.id > 0) {
        // alert('We have an ID, proj id = ' + this.state.id + ', title = ' + this.state.title);
        // We have a project id passed through the URL, do an
        // update on the project.
        let updatePath = "/api/projects/" + this.state.id;
        fetch(updatePath, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(data => {
            this.setState({ msg: "Project updated." });
          })
          .catch(err => {
            this.setState({ msg: "Error occurred." });
          });
      } else {
        // No project id, so we will do a create.  The difference
        // is we do a POST instead of a PUT.
        fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(data => {
            //console.log(data);
          })
          .catch(err => {
            this.setState({ msg: "Error occurred." });
          });
      }
      //setSubmitting(false);
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
    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <Typography color="secondary" gutterBottom>
          {this.state.msg}
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
              <InputLabel htmlFor="kpi-simple">Main KPI</InputLabel>
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
        </Grid>
      </form>
    );
  }
}

export default withStyles(styles)(ProjectDetail);
