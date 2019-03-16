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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit(event) {
    event.preventDefault();
  }

  componentDidMount() {
    fetch("/api/organizations/?format=select")
      .then(results => results.json())
      .then(organizations => this.setState({ organizations }));
  }

  render() {
    const { classes } = this.props;
    //const currentPath = this.props.location.pathname;

    /* react-router has injected the value of the attribute ID into the params */
    //const id = this.props.match.params.id;

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
                          <InputLabel htmlFor="organization-simple">
                            Organization
                          </InputLabel>
                          <Select
                            value={this.state.orgId}
                            onChange={this.handleSelectChange}
                            renderValue={value => this.state.orgId}
                            inputProps={{
                              name: "org",
                              id: "orgId"
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
