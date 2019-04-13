/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/OrganizationCard.js
 * Created:  2019-03-01
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-01
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
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import SectionHeader from "./typo/SectionHeader";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import classnames from "classnames";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import OrgToolbar from "./navigation/OrgToolbar";

const ExpandingSectionGridItem = (classes, project) => {
  // TODO - add the org's project list here.
  // Just a placeholder for stuff we'll put in the expanding section.  Considering putting action items here.
  return (
    <div className={classes.inlineLeft}>
      <Typography
        variant="h6"
        style={{ textTransform: "uppercase" }}
        color="secondary"
        gutterBottom
      >
        This organization s projects
      </Typography>
      <Typography variant="h5" gutterBottom>
        Project #1
      </Typography>
      <Typography variant="h7" gutterBottom>
        Leading KPI
        <br />
        Project started 12 February 2018
        <br />
      </Typography>
      <Typography variant="h5" gutterBottom>
        Project #2
      </Typography>
      <Typography variant="h7" gutterBottom>
        Leading KPI
        <br />
        Project started 14 March 2018
        <br />
      </Typography>
    </div>
  );
};

class OrganizationCard extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showToolbar = this.showToolbar.bind(this);
  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    project: {},
    organizations: [],
    orgname: "",
    orgId: 0,
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

  showToolbar() {
    // If we have a project ID, show the toolbar.
    let toolbarText = "";
    if (parseInt(this.state.id) > 0) {
      toolbarText = <OrgToolbar orgid={this.state.id}/>;
    }
    return toolbarText;
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.id > 0) {
      // alert('We have an ID, proj id = ' + this.state.id + ', title = ' + this.state.title);
      // We have a project id passed through the URL, do an
      // update on the project.
      let updatePath = "/api/organizations/" + this.state.id;
      fetch(updatePath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state)
      })
        .then(data => {
          //console.log(data);
        })
        .catch(err => {
          //console.log(err);
        });
    } else {
      // No project id, so we will do a create.  The difference
      // is we do a POST instead of a PUT.
      fetch("/api/organizations", {
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
  }

  componentDidMount() {
    if (parseInt(this.props.match.params.id) > 0) {
      fetch(`/api/organizations/${this.props.match.params.id}`)
        .then(res => res.json())
        .then(organization => {
          this.setState({
            id: this.props.match.params.id,
            name: organization.name,
            orgId: organization.orgId,
            projects: organization.projects,
            organization: organization
          });
        });
    } else {
      this.setState({ isEditing: true });
    }
    // Have to set the state of the individual fields for the handleChange function for the TextFields.
    // Do this using the project state.
    // For this org, use the projects member variable, it already did
    // the query for the projects related to this org

    fetch("/api/projects/")
      .then(results => results.json())
      .then(projects => this.setState({ projects }));
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
                      {this.showToolbar()}
                      <Table>
                        <TableRow>
                          <TableCell style={{ verticalAlign: "top" }}>
                            <Typography
                              style={{ textTransform: "uppercase" }}
                              color="secondary"
                              gutterBottom
                            />
                            <Typography variant="h5" component="h2">
                              <TextField
                                required
                                id="title-required"
                                label="Name"
                                onChange={this.handleChange("name")}
                                value={this.state.name}
                                className={classes.textField}
                                margin="normal"
                              />
                            </Typography>
                            <Typography variant="h5" component="h2">
                              <div className={classes.spaceTop}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={this.handleSubmit}
                                  className={classes.secondary}
                                >
                                  Submit
                                </Button>
                              </div>
                              <br />
                              <div className={classes.spaceTop}>
                                <Button
                                  component={Link}
                                  to={`/listprojects/${
                                    this.props.match.params.id
                                  }`}
                                >
                                  List Projects
                                </Button>
                              </div>
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </Table>
                    </CardContent>
                    <CardActions
                      className={classes.actions}
                      disableActionSpacing
                    >
                      <IconButton
                        className={classnames(classes.expand, {
                          [classes.expandOpen]: this.state.expanded
                        })}
                        onClick={this.handleExpandClick}
                        aria-expanded={this.state.expanded}
                        aria-label="Show more"
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </CardActions>
                    <Collapse
                      in={this.state.expanded}
                      timeout="auto"
                      unmountOnExit
                    >
                      <CardContent>
                        {ExpandingSectionGridItem(classes, this.state.project)}
                      </CardContent>
                    </Collapse>
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

export default withStyles(styles)(OrganizationCard);
