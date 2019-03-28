/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/Login.js
 * Created:  2019-02-04
 * Author:   Brad Kaufman
 * Descr:    Login and authentication for the app.
 * -----
 * Modified: 2019-03-28
 * Editor:   Brad Kaufman
 */
import React from "react";
import { Link, Redirect } from "react-router-dom";
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
import Button from "@material-ui/core/Button";
import { store, reducers, setUser, setOrg, getUser, getOrg } from "../redux";

class Login extends React.Component {
  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    id: "",
    email: "",
    pwdhash: "",
    password: "",
    isEditing: false,
    isLoggedIn: false,
    isFailedLogin: false,
    readyToRedirect: false,
    userData: "",
    storeUser: "",
    expanded: false,
    labelWidth: 0,
    msgText: ""
  };

  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit(event) {
    event.preventDefault();

    // Authenticate against the username
    fetch("/api/auth/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    })
      .then(response => {
        if (!response.ok) {
          // here, we get out of the then handlers and
          // over to the catch handler
          throw new Error("Network response was not ok.");
        } else {
          // status code 200 is success.
          console.log("Login.js, logged in. Status = 200");
          return response.json();
        }
      })
      .then(data => {
        store.dispatch(setUser(JSON.stringify(data)));
        console.log("Login.js, user:" + JSON.stringify(data));
      })
      .then(() => {
        console.log("Ready to redirect");
        this.setState({
          isLoggedIn: true,
          readyToRedirect: true
        });
      })
      .catch(err => {
        // TODO - set error login on form.
        this.setState({
          isFailedLogin: true,
          msgText: "Login failed, please try again."
        });
      });
  }

  componentDidMount() {}

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    if (this.state.readyToRedirect) {
      return <Redirect to="/clientorg" />;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
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
                <Grid item xs={12} md={4}>
                  <SectionHeader title="" subtitle="" />
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        component="h2"
                        color="secondary"
                        gutterBottom
                      >
                        Please login
                      </Typography>
                      <Typography
                        variant="h5"
                        component="h2"
                        style={{ textTransform: "uppercase" }}
                        color="secondary"
                        gutterBottom
                      >
                        {this.state.msgText}
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
                          type="Password"
                          onChange={this.handleChange("password")}
                          value={this.state.password}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Typography>
                      <Typography variant="h5" component="h2">
                        <div className={classes.spaceTop}>
                          <br />
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
//
export default withStyles(styles)(Login);
