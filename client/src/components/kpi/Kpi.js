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
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Typography from "@material-ui/core/Typography/index";
import Topbar from "../Topbar";
import { styles } from "../styles/MaterialSense";
import Card from "@material-ui/core/Card/index";
import CardContent from "@material-ui/core/CardContent/index";
import Grid from "@material-ui/core/Grid/index";
import SectionHeader from "../typo/SectionHeader";
import TextField from "@material-ui/core/TextField/index";
import Table from "@material-ui/core/Table/index";
import TableRow from "@material-ui/core/TableRow/index";
import TableCell from "@material-ui/core/TableCell/index";
import Button from "@material-ui/core/Button/index";
import Select from "@material-ui/core/Select/index";
import FormControl from "@material-ui/core/FormControl/index";
import MenuItem from "@material-ui/core/MenuItem/index";
import InputLabel from "@material-ui/core/InputLabel/index";
import { getOrgId, getOrgName, getOrgDepartments } from "../../redux";
import { Redirect } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";
import "../styles/ReactTags.css";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class KpiCard extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.setOrganizationInfo = this.setOrganizationInfo.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    project: {},
    projectId: 0,
    title: "",
    type: "",
    level: "",
    org: "",
    orgId: 0,
    orgName: "",
    projectName: "",
    departments: [],
    deptId: 0,
    description: "",
    formula: "",
    startAt: "",
    endAt: "",
    msg: "",
    kpitype: "",
    buttonText: "Create",
    isEditing: false,
    redirect: false,
    isNew: false,
    expanded: false,
    hasError: false,
    labelWidth: 0,
    focus: false,
    nextItem: "",
    tags: [{id: "", text: ""}],
    suggestions: [
      { id: "Cluster analysis", text: "Cluster analysis" },
      { id: "Linear regression", text: "Linear regression" },
      { id: "Monte Carlo simulations", text: "Monte Carlo simulations" },
      { id: "Time-series analysis", text: "Time-series analysis" },
      { id: "Natural language processing", text: "Natural language processing" },
      { id: "Predictive analytics", text: "Predictive analytics" },
      { id: "Logistic regression", text: "Logistic regression" },
      { id: "Machine learning", text: "Machine learning" }
    ]
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

  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleAddition(tag) {
    this.setState(state => ({ tags: [...state.tags, tag] }));
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  handleSubmit(event) {
    event.preventDefault();
    // Project ID and KPI id (if there is the latter, are passed in by location.state.
    const projectId = this.props.location.state.projectId;
    const kpiId = this.props.location.state.kpiId;

    setTimeout(() => {
      if (kpiId > 0) {
        let updatePath = "/api/kpis/" + kpiId;
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
        // No KPI id, so we will do a create.  The difference
        // is we do a POST instead of a PUT.
        fetch("/api/kpis", {
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
    const kpiId = this.props.location.state.kpiId;

    if (parseInt(kpiId) > 0) {
      fetch(`/api/kpis/${kpiId}`)
        .then(res => res.json())
        .then(kpi => {
          this.setState({
            id: kpiId,
            title: kpi.title,
            description: kpi.description,
            level: kpi.level,
            formula: kpi.formulaDescription,
            orgId: kpi.orgId,
            projectName: kpi.project.title,
            deptId: kpi.deptId,
            type: kpi.type,
            kpitype: kpi.type,
            tags: kpi.tags.map(item => ({
              id: item.tag,
              text: item.tag,
            })),
            projectId: projectId,
            buttonText: "Update"
          });
          let x = 1;
        });
    } else {
      this.setState({
        isEditing: true,
        projectId: projectId,
        buttonText: "Create"
      });
    }
    // Have to set the state of the individual fields for the handleChange function for the TextFields.
    // Do this using the project state.

    fetch("/api/organizations/?format=select")
      .then(results => results.json())
      .then(organizations => this.setState({ organizations }));
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
        <form onSubmit={this.handleSubmit} noValidate>
          <div className={classes.root}>
            <Grid container alignItems="center" justify="center" spacing={24} lg={12}>
              <Grid item lg={10}>
                <Paper className={classes.paper}>

                  <Typography
                    style={{ textTransform: "uppercase" }}
                    color="secondary"
                    gutterBottom
                  >
                    KPI Detail<br/>
                  </Typography>
                  <Typography variant="h6">
                    Project: {this.state.projectName}
                  </Typography>
                  <Typography variant="h6">
                    Organization: {getOrgName()}
                  </Typography>
                  <Typography variant="h5" component="h2">
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
                      id="formula"
                      label="Formula Description"
                      multiline
                      rowsMax="6"
                      value={this.state.formula}
                      onChange={this.handleChange("formula")}
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
                      <InputLabel htmlFor="dept-simple">
                        Department
                      </InputLabel>
                      <Select
                        value={this.state.deptId}
                        onChange={this.handleSelectChange}
                        inputProps={{
                          name: "deptId",
                          id: "deptId"
                        }}
                      >
                        {this.state.departments.map(dept => {
                          return (
                            <MenuItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <br />
                    <br />
                  </Typography>
                  <Typography component="p">
                    <TextField
                      id="level"
                      label="Level"
                      onChange={this.handleChange("level")}
                      value={this.state.level}
                      className={classes.textField}
                      margin="normal"
                    />
                  </Typography>
                  <Typography component="p">
                    <InputLabel shrink htmlFor="kpi-type-simple">KPI Type</InputLabel><br/>
                    <FormControl className={classes.formControl}>
                      <Select
                        value={this.state.type}
                        onChange={this.handleSelectChange}
                        inputProps={{
                          name: 'type',
                          id: 'kpi-type-simple',
                        }}
                      >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="lagging">Lagging</MenuItem>
                        <MenuItem value="leading">Leading</MenuItem>
                      </Select>
                    </FormControl>
                    <br/><br/><br/>
                  </Typography>
                  <div>
                    <Typography component="p">
                      KPI Tags
                    </Typography>
                    <ReactTags
                      classNames={{
                        tags: "ReactTags__tags",
                        tagInput: "ReactTags__tagInput",
                        tagInputField: "ReactTags__tagInput input.ReactTags__tagInputField:focus",
                        selected: "ReactTags__selected",
                        suggestions: "ReactTags__suggestions ul",
                        activeSuggestion: "ReactTags__suggestions ul li.ReactTags__activeSuggestion"}}
                      tags={tags}
                      suggestions={suggestions}
                      handleDelete={this.handleDelete}
                      handleAddition={this.handleAddition}
                      handleDrag={this.handleDrag}
                      delimiters={delimiters} />
                  </div>
                  <br /><br />
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


                </Paper>
              </Grid>
            </Grid>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(KpiCard);
