/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ProjectCard.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-24
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
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";

class KpiCard extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    project: {},
    organizations: [],
    projid: 0,
    title: "",
    type: "",
    level: "",
    org: "",
    orgId: "",
    description: "",
    startAt: "",
    endAt: "",
    msg: "",
    isEditing: false,
    redirect: false,
    isNew: false,
    expanded: false,
    labelWidth: 0
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSelectChange = event => {
    this.setState({ orgId: event.target.value });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  //handleSubmit(values, {resetForm, setErrors, setSubmitting}) {
  handleSubmit(event) {
    event.preventDefault();

    setTimeout(() => {
      if (this.state.id > 0) {
        // alert('We have an ID, proj id = ' + this.state.id + ', title = ' + this.state.title);
        // We have a project id passed through the URL, do an
        // update on the project.
        let updatePath = "/api/kpis/" + this.state.id;
        fetch(updatePath, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(response => {
            if (response.status.toString().localeCompare("201")) {
              alert(response.status);
              this.setState({ msg: "Updated" });
            }
          })
          .catch(err => {
            //console.log(err);
          });
      } else {
        // No project id, so we will do a create.  The difference
        // is we do a POST instead of a PUT.
        fetch("/api/kpis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.state)
        })
          .then(data => {
            //console.log(data);
          })
          .catch(err => {
            //console.log(err);
          });
      }
      //setSubmitting(false);
    }, 2000);
  }

  componentDidMount() {
    if (parseInt(this.props.match.params.id) > 0) {
      fetch(`/api/kpis/${this.props.match.params.id}`)
        .then(res => res.json())
        .then(kpi => {
          this.setState({
            id: this.props.match.params.id,
            title: kpi.title,
            description: kpi.description,
            level: kpi.level,
            orgId: kpi.orgId,
            type: kpi.type,
            projectid: kpi.projectId
          });
        });
    } else {
      this.setState({ isEditing: true });
    }
    // Have to set the state of the individual fields for the handleChange function for the TextFields.
    // Do this using the project state.

    fetch("/api/organizations/?format=select")
      .then(results => results.json())
      .then(organizations => this.setState({ organizations }));
  }

  render() {
    const { classes } = this.props;
    //const currentPath = this.props.location.pathname;

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
                      <Table>
                        <TableRow>
                          <TableCell style={{ verticalAlign: "top" }}>
                            <Typography
                              style={{ textTransform: "uppercase" }}
                              color="secondary"
                              gutterBottom
                            >
                              KPI Detail
                            </Typography>
                          </TableCell>
                          <Typography color="secondary" gutterBottom>
                            {this.state.msg}
                          </Typography>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ verticalAlign: "top" }}>
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
                            <Typography variant="h5" component="h2">
                              <TextField
                                id="level"
                                label="Level"
                                onChange={this.handleChange("level")}
                                value={this.state.level}
                                className={classes.textField}
                                margin="normal"
                              />
                            </Typography>
                            <Typography variant="h5" component="h2">
                              <TextField
                                required
                                id="type"
                                label="Type"
                                onChange={this.handleChange("type")}
                                value={this.state.type}
                                className={classes.textField}
                                margin="normal"
                              />
                            </Typography>
                            <div className={classes.spaceTop}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleSubmit}
                                className={classes.secondary}
                              >
                                Update
                              </Button>
                            </div>
                            <br />
                          </TableCell>
                        </TableRow>
                      </Table>
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

export default withStyles(styles)(KpiCard);
