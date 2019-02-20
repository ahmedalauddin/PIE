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
import { styles } from "./MaterialSense";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import SectionHeader from "./typo/SectionHeader";
import TextField from "@material-ui/core/TextField";
import Log from "./Log";
import Button from "@material-ui/core/Button";
import AuthHelper from "./AuthHelper";

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

class Login extends React.Component {
  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    id: "",
    email: "",
    username: "",
    pwdhash: "",
    password: "",
    isEditing: false,
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

  /*
    handleSubmit(event) {
        event.preventDefault();
        //alert('In HandleSubmit, state is: ' + JSON.stringify(this.state));
        setTimeout(() => {
            // Authenticate against the username
            fetch('/api/authenticate/', {
            //fetch('/api/person/username/' + this.state.username, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.state),
            }).then(function (response) {
                //alert('Response from post: ' + response.json());
                //alert('Response from post: ' + response.statusMessage);
                //alert('Response from post (message): ' + response.get('message'));
                alert('Response from post: ' + response.json());
            }).catch(function (err) {
                //alert('login failed');
            });
            //setSubmitting(false);
        }, 2000);
    }
*/
  handleSubmit = e => {
    e.preventDefault();

    /* Here is where all the login logic will go. Upon clicking the login button, we would like to utilize a login method that will send our entered credentials over to the server for verification. Once verified, it should store your token and send you to the protected route. */
    this.Auth.login(this.state.username, this.state.password)
      .then(res => {
        if (res === false) {
          return alert("Sorry those credentials don't exist!");
        }
        this.props.history.replace("/");
      })
      .catch(err => {
        alert(err);
      });
  };
  componentDidMount() {}

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
                        gutterBottom > gutterBottom > Login
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
                          id="email"
                          label="Email"
                          onChange={this.handleChange("email")}
                          value={this.state.email}
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

export default withStyles(styles)(Login);
