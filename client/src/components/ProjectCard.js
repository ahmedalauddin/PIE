/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ProjectCard.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-04-19
 * Editor:   Brad Kaufman
 * Notes:    Uses Material UI controls, including simple select, see https://material-ui.com/demos/selects/.
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "./Topbar";
import { styles } from "./styles/MaterialSense";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import SectionHeader from "./typo/SectionHeader";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Redirect } from "react-router-dom";
import CardToolbar from "./navigation/CardToolbar";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { getOrgId, getOrgName, getOrgDepartments } from "../redux";
import ReactDOM from "react-dom";
import { Editor, EditorState } from "draft-js";
import "../stylesheets/Draft.css";

class ProjectCard extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKpiSelectChange = this.handleKpiSelectChange.bind(this);
    this.showToolbar = this.showToolbar.bind(this);
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
    editorState: EditorState.createEmpty(),
    org: "",
    orgId: "",
    orgName: "",
    description: "",
    mainKpiId: 0,
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

    if (parseInt(this.props.match.params.id) > 0) {
      fetch(`/api/projects/${this.props.match.params.id}`)
        .then(res => res.json())
        .then(project => {
          this.setState({
            id: this.props.match.params.id,
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

  showToolbar() {
    // If we have a project ID, show the toolbar.
    let toolbarText = "";
    if (parseInt(this.state.id) > 0) {
      toolbarText = <CardToolbar projid={this.state.id} />;
    }
    return toolbarText;
  }

  componentDidCatch() {
    return <Redirect to="/Login" />;
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
        <Topbar />
        <form onSubmit={this.handleSubmit} noValidate>
          <div className={classes.root}>
            <Grid container justify="center">
              <Grid
                spacing={24}
                alignItems="center"
                justify="center"
                container
                className={classes.grid}
              >
                <Grid item xs={12}>
                  <SectionHeader title="" subtitle="" />
                  <Card className={classes.card}>
                    <CardContent>
                      {this.showToolbar()}
                      <Grid item container xs={12}>
                        <Grid item xs={6}>
                          <Typography color="secondary" gutterBottom>
                            {this.state.msg}
                          </Typography>
                          <Typography variant="h5" component="h2">
                            <TextField
                              required
                              id="title-required"
                              label="Title"
                              onChange={this.handleChange("title")}
                              value={this.state.title}
                              className={classes.textField}
                              margin="normal"
                            />
                          </Typography>
                          <Typography component="p">
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
                          </Typography>
                          <Typography component="p">
                            <TextField
                              id="businessGoal"
                              label="Business Goal"
                              multiline
                              rowsMax="4"
                              value={this.state.businessGoal}
                              onChange={this.handleChange("businessGoal")}
                              className={classes.textField}
                              fullWidth
                              margin="normal"
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          </Typography>
                          <Typography component="p">
                            <FormControl className={classes.formControl}>
                              <InputLabel htmlFor="kpi-simple">
                                Main KPI
                              </InputLabel>
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
                            <br />
                            <br />
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.inlineRight}>
                            <Typography component="p">
                              <TextField
                                id="startAt"
                                label="Start Date"
                                type="date"
                                value={this.state.startAt}
                                onChange={this.handleChange("startAt")}
                                className={classes.textField}
                                InputLabelProps={{
                                  shrink: true
                                }}
                              />
                            </Typography>
                            <Typography component="p">
                              <TextField
                                id="endAt"
                                label="End Date"
                                type="date"
                                value={this.state.endAt}
                                onChange={this.handleChange("endAt")}
                                className={classes.textField}
                                InputLabelProps={{
                                  shrink: true
                                }}
                              />
                            </Typography>

                            <Typography variant="h6" gutterBottom>
                              <Typography variant="h5" component="h2">
                                <TextField
                                  id="standard-required"
                                  label="Progress"
                                  onChange={this.handleChange("progress")}
                                  value={this.state.progress}
                                  className={classes.textField}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        %
                                      </InputAdornment>
                                    )
                                  }}
                                />
                              </Typography>
                            </Typography>
                            <div className={classes.spaceTop}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleSubmit}
                                className={classes.secondary}
                              >
                                {this.state.buttonText}
                              </Button>
                            </div>
                            <br />
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProjectCard);
