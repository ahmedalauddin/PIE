/**
 * ProjectCard - add and edit projects component
 *
 * Uses Material UI controls, including simple select, see https://material-ui.com/demos/selects/.
 *
 */
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "./Topbar";
//import ButtonBar from './buttons/ButtonBar';
//import Button from '@material-ui/core/Button';
import { styles } from "./MaterialSense";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import SectionHeader from "./typo/SectionHeader";
import classnames from "classnames";
import { red } from "@material-ui/core/colors";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";

const materialstyles = theme => ({
  card: {
    maxWidth: 400
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
});

const ExpandingSectionGridItem = (classes, project) => {
  // Just a placeholder for stuff we'll put in the expanding section.  Considering putting action items here.
  return (
    <div className={classes.inlineLeft}>
      <Typography
        variant="h6"
        style={{ textTransform: "uppercase" }}
        color="secondary"
        gutterBottom
      >
        > Other Prioritized KPIs
      </Typography>
      <Typography variant="h5" gutterBottom>
        Service BOM Accuracy
      </Typography>
    </div>
  );
};

const buttonstyles = theme => ({
  primary: {
    marginRight: theme.spacing.unit * 2
  },
  secondary: {
    background: theme.palette.secondary["100"],
    color: "white"
  },
  spaceTop: {
    marginTop: 20
  }
});

const saltRounds = 4;

class Signup extends React.Component {
  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    org: "",
    orgId: 0,
    organizations: [],
    isEditing: false,
    isNew: false,
    expanded: false,
    labelWidth: 0
  };

  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
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

    setTimeout(() => {
      /*
            if (this.state.id > 0) {
                // alert('We have an ID, proj id = ' + this.state.id + ', title = ' + this.state.title);
                // We have a project id passed through the URL, do an
                // update on the project.
                let updatePath = '/api/person/' + this.state.email;
                fetch(updatePath, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(this.state),
                }).then(function (data) {
                    //console.log(data);
                }).catch(function (err) {
                    //console.log(err);
                });
            } else {
            */
      // No person id, so we will do a create.  The difference
      // is we do a POST instead of a PUT.

      // This uses the Person Create function.
      fetch("/api/person", {
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
      //}
      //setSubmitting(false);
    }, 2000);
  }

  // Return boolean for whether the project exists.
  projectExists() {
    if (parseInt(this.props.match.params.id) > 0) {
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    if (parseInt(this.props.match.params.id) > 0) {
      fetch("/api/person/" + this.props.match.params.id)
        .then(res => res.json())
        .then(person => {
          this.setState({
            id: this.props.match.params.id,
            email: person.email,
            firstName: person.firstName,
            lastName: person.lastName,
            orgId: person.orgId,
            pwdhash: person.pwdhash,
            username: person.username
          });
          //alert('project.orgId = ' + this.state.orgId + ', title = ' + this.state.title + ', org = ' + this.state.org);
        });
    } else {
      this.setState({ isEditing: true });
    }
    // Have to set the state of the individual fields for the handleChange function for the TextFields.
    // Do this using the project state.

    fetch("/api/organizations/select")
      .then(results => results.json())
      .then(organizations => {
        this.setState({ organizations });
      });
  }

  render() {
    const { classes } = this.props;
    //const currentPath = this.props.location.pathname;

    /* react-router has injected the value of the attribute ID into the params */
    const id = this.props.match.params.id;

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
                      <Typography
                        style={{ textTransform: "uppercase" }}
                        color="secondary"
                        gutterBottom
                      >
                        gutterBottom > gutterBottom > Signup
                      </Typography>

                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          id="firstName"
                          label="First Name"
                          onChange={this.handleChange("firstName")}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          id="lastName"
                          label="Last Name"
                          onChange={this.handleChange("lastName")}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          id="email"
                          label="Email Address"
                          onChange={this.handleChange("email")}
                          value={this.state.email}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          id="username"
                          label="Username"
                          onChange={this.handleChange("username")}
                          value={this.state.username}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <TextField
                          required
                          id="password"
                          label="Password"
                          onChange={this.handleChange("password")}
                          value={this.state.password}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <FormControl className={classes.formControl}>
                          <InputLabel htmlFor="org-simple">
                            Organization
                          </InputLabel>
                          <Select
                            value={this.state.orgId}
                            onChange={this.handleSelectChange}
                            inputProps={{
                              name: "orgId",
                              id: "org-simple"
                            }}
                          >
                            {this.state.organizations.map(org => {
                              return (
                                <MenuItem key={org.id} value={org.id}>
                                  {org.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                        <br />
                        <br />
                        <br />
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
                      </Typography>
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

export default withStyles(styles)(Signup);

/*
getOrgFromEmail = () => {
    // Figure out what the organization is from the email address.
    const emailParsed = EmailAddresses.parseOneAddress(this.state.email);
    const domain = emailParsed.domain;
    var domainarr = [];
    domainarr = domain.split('.');
    const company = domainarr[domainarr.length-2];
    alert('company: ' + company);
    var orgId = 1;

    var orgPath = '/api/organization/name/' + company;
    alert('orgPath: ' + orgPath);
    setTimeout(() => {
        fetch(orgPath)
            .then(res => res.json())
            .then(results => {
                orgId = results.id;
            });
    }, 2000);

    return(orgId);
}
*/
