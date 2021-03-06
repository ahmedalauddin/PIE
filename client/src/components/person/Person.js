/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/person/Person.js
 * Descr:    Person component.  Allows create and update.
 * Created:  2019-05-23
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-06-15
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { getOrgName } from "../../redux";
import { Redirect } from "react-router-dom";
import "../styles/ReactTags.css";
import Paper from "@material-ui/core/Paper";
import { red } from "@material-ui/core/colors";
import Snackbar from "@material-ui/core/Snackbar";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    paddingBottom: 200
  },
  grid: {
    width: 1200,
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  rangeLabel: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.unit * 2
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32
  },
  outlinedButton: {
    textTransform: "uppercase",
    margin: theme.spacing.unit
  },
  actionButton: {
    textTransform: "uppercase",
    margin: theme.spacing.unit,
    width: 152
  },
  blockCenter: {
    padding: theme.spacing.unit * 2,
    textAlign: "center"
  },
  block: {
    padding: theme.spacing.unit * 2
  },
  box: {
    marginBottom: 40,
    height: 65
  },
  inlining: {
    display: "inline-block",
    marginRight: 10
  },
  buttonBar: {
    display: "flex"
  },
  alignRight: {
    display: "flex",
    justifyContent: "flex-end"
  },
  noBorder: {
    borderBottomStyle: "hidden"
  },
  loadingState: {
    opacity: 0.05
  },
  loadingMessage: {
    position: "absolute",
    top: "40%",
    left: "40%"
  },
  card: {
    maxWidth: 1000
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
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
  textFieldWide: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  spaceTop: {
    marginTop: 50
  }
});

class Person extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    orgId: null,
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    departments: [],
    deptId: null,
    buttonText: "Create",
    readyToRedirect: false,
    validationError: false,
    openSnackbar: false,
    message: "",
    isEditing: false,
    redirect: false,
    isNew: false,
    expanded: false,
    statusList: [],
    hasError: false,
    labelWidth: 0,
    focus: false,
    nextItem: "",
    referrer: ""
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


  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  handleSubmit(event) {
    event.preventDefault();
    const personId = this.props.location.state.personId;
    const orgId = this.props.location.state.organizationId;
    let apiPath = "";
    let successMessage = "";
    let method = "";

    if (personId > 0) {
      // For updates
      apiPath = "/api/persons/" + personId;
      successMessage = "User " + this.state.lastName + " updated."
      method = "PUT";
    } else {
      // For create
      apiPath = "/api/persons";
      successMessage = "User " + this.state.lastName + " created."
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
          this.setState({
            message: successMessage,
            readyToRedirect: true
          });
        })
        .catch(err => {
          this.setState({ message: "Error occurred." });
        });
    }, 2000);
  };

  componentDidMount() {
    let personId = this.props.location.state.personId;
    let orgId = this.props.location.state.organizationId;
    let referrer = this.props.location.state.referrer;

    if (parseInt(personId) > 0) {
      fetch(`/api/persons/${personId}`)
        .then(res => res.json())
        .then(person => {
          this.setState({
            id: personId,
            orgId: orgId,
            fullName: person.fullName,
            firstName: person.firstName,
            lastName: person.lastName,
            email: person.email,
            role: person.role,
            deptId: person.deptId,
            buttonText: "Update",
            referrer: referrer
          });
        });
    } else {
      this.setState({
        isEditing: true,
        orgId: orgId,
        buttonText: "Create",
        referrer: referrer
      });
    }

    fetch("/api/departments/org/" + orgId)
      .then(results => results.json())
      .then(departments => this.setState({ departments: departments }));
  }

  render() {
    const { classes } = this.props;
    const orgId = this.props.location.state.organizationId;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    if (this.state.readyToRedirect) {
      return <Redirect to={{
        pathname: `/organization/${orgId}`,
        state: {
          message: `${this.state.message}`
        }
      }} />;
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
                  <Typography
                    variant="h7"
                    color="secondary"
                    gutterBottom
                  >
                    User<br/>
                  </Typography>
                  <Typography variant="h7">
                    Organization: {getOrgName()}
                  </Typography>
                  <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="firstName"
                        label="First Name"
                        fullWidth
                        onChange={this.handleChange("firstName")}
                        value={this.state.firstName}
                        className={classes.textField}
                        margin="normal"
                      />
                      <TextField
                        required
                        id="lastName"
                        label="Last Name"
                        fullWidth
                        onChange={this.handleChange("lastName")}
                        value={this.state.lastName}
                        className={classes.textField}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="email"
                        label="Email Address"
                        fullWidth
                        onChange={this.handleChange("email")}
                        value={this.state.email}
                        className={classes.textField}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id="role"
                        label="Role"
                        fullWidth
                        onChange={this.handleChange("role")}
                        value={this.state.role}
                        className={classes.textField}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl className={classes.formControl}>
                        <InputLabel shrink htmlFor="department-simple">
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
                          {this.state.departments.map(department => {
                            return (
                              <MenuItem key={department.id} value={department.id}>
                                {department.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
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
                    </Grid>
                    <br />
                  </Grid>
                </form>
              </Paper>
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

export default withStyles(styles)(Person);

