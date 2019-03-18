/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/Login.js
 * Created:  2019-02-04
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-17
 * Editor:   Brad Kaufman
 */
import React from "react";
import { Redirect } from "react-router-dom";
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
import Button from "@material-ui/core/Button";
import { UserProvider } from "./UserContext";

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
        if (response.status === 200) {
          // status code 200 is success.
          this.setState({ isLoggedIn: true });

          // TODO - call setUserOrg() here.
          let user = response.json();
          UserProvider.setUserOrg(user, null);
        } else {
          this.setState({ isFailedLogin: true, isLoggedIn: false });
          this.setState({ msgText: "Login failed, please try again." });
        }
      })
      .catch(err => {
        // TODO - set error login on form.
        this.setState({ isFailedLogin: true });
        this.setState({ msgText: "Login failed, please try again." });
      });
  }

  componentDidMount() {}

  render() {
    const { classes } = this.props;
    //const currentPath = this.props.location.pathname;

    /* react-router has injected the value of the attribute ID into the params */
    //const id = this.props.match.params.id;
    let redirect = "";
    if (this.state.isLoggedIn) {
      if (
        this.state.email.toLowerCase().includes("@valueinfinity.com") ||
        this.state.email.toLowerCase().includes("@th.io")
      ) {
        redirect = "/ListProjects";
      } else {
        redirect = "/";
      }
      return <Redirect to={redirect} />;
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

export default withStyles(styles)(Login);
