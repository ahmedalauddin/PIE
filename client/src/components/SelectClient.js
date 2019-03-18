/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/SelectClient.js
 * Created:  2019-03-01
 * Author:   Brad Kaufman
 * Descr:    After the login component, allow ValueInfinity users to select
 *           which organization they want to work with.
 * -----
 * Modified:
 * Editor:
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
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import SectionHeader from "./typo/SectionHeader";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";

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

class SelectClient extends React.Component {
  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    id: "",
    organizations: [],
    org: "",
    orgId: 0,
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
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit(event) {
    event.preventDefault();

    // Set the JWT token with the org ID>
    fetch("/api/auth/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    })
      .then(response => {
        if (response.status === 200) {
          // status code 200 is success.
          this.setState({ isLoggedIn: true });
        } else {
          this.setState({ isFailedLogin: true, isLoggedIn: false });
          this.setState({ msgText: "Setting token failed, please try again." });
        }
      })
      .catch(err => {
        // TODO - set error login on form.
        this.setState({ isFailedLogin: true });
        this.setState({ msgText: "Setting token failed, please try again." });
      });
  }

  componentDidMount() {
    fetch("/api/organizations/?format=select")
      .then(results => results.json())
      .then(organizations => this.setState({ organizations }));
  }

  render() {
    const { classes } = this.props;
    //const currentPath = this.props.location.pathname;

    if (this.state.isLoggedIn) {
      return <Redirect to="/" />;
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
                        Select client
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

export default withStyles(styles)(SelectClient);
