/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/department/Department.js
 * Descr:    Department component.  Allows create and update.
 * Created:  2019-05-17
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-06-15
 * Editor:   Brad Kaufman
 * Notes:
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import Grid from "@material-ui/core/Grid/index";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import "../styles/ReactTags.css";
import Paper from "@material-ui/core/Paper";
import {red} from "@material-ui/core/colors";
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

class Department extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
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
    orgName: "",
    msg: "",
    statusId: 0,
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
    const departmentId = parseInt(this.props.location.state.departmentId);
    let apiPath = "";
    let successMessage = "";
    let method = "";

    if (departmentId > 0) {
      // For updates
      apiPath = "/api/departments/" + departmentId;
      successMessage = "Department '" + this.state.name + "' updated."
      method = "PUT";
    } else {
      // For create
      apiPath = "/api/departments/";
      successMessage = "Department '" + this.state.name + "' created."
      method = "POST";
    }

    setTimeout(() => {
      fetch(apiPath, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then((response) => {
          if (response.status === 400) {
            // Error: for now, we'll assume it's with the milestone not being within the project start and end dates.
            this.setState({
              readyToRedirect: false,
              message: "Error",
              openSnackbar: true
            });
          } else {
            // Redirect to the Organization component.
            this.setState({
              readyToRedirect: true,
              message: successMessage
            });
          }
        })
        .catch(err => {
          this.setState({ message: "Error occurred." });
        });
    }, 2000);
  };

  componentDidMount() {
    const organizationId = this.props.location.state.organizationId;
    const departmentId = this.props.location.state.departmentId;

    if (parseInt(departmentId) > 0) {
      fetch(`/api/departments/${departmentId}`)
        .then(res => res.json())
        .then(department => {
          this.setState({
            id: departmentId,
            name: department.name,
            description: department.description,
            orgName: department.organization.name,
            orgId: organizationId
          });
        });
    } else {
      fetch(`/api/organizations/${organizationId}`)
        .then(res => res.json())
        .then(organization => {
          this.setState({
            orgName: organization.name,
            orgId: organizationId,
            buttonText: "Create"
          });
        });
    }
  }

  render() {
    const { classes } = this.props;
    const organizationId = this.props.location.state.organizationId;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }
    if (this.state.readyToRedirect) {
      return <Redirect to={{
        pathname: `/organization/${organizationId}`,
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
          <Grid container alignItems="center" justify="center" spacing={24} sm={12}>
            <Grid item sm={10}>
              <Paper className={classes.paper}>
                <form onSubmit={this.handleSubmit} noValidate>
                  <Typography
                    variant="h7"
                    color="secondary"
                    gutterBottom
                  >
                    Department Detail<br/>
                  </Typography>
                  <Typography variant="h7">
                    Organization: {this.state.orgName}
                  </Typography>
                  <Grid container spacing={24}>
                    <Grid item sm={10}>
                      <TextField
                        required
                        shrink
                        id="name"
                        label="Name"
                        fullWidth
                        onChange={this.handleChange("name")}
                        value={this.state.name}
                        className={classes.textField}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item sm={10}>
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
                    <Grid item sm={10}>
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

export default withStyles(styles)(Department);
