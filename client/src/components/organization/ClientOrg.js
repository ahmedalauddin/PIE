/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ClientOrg.js
 * Created:  2019-02-04
 * Author:   Brad Kaufman
 * Description: Filter client organization for VI personnel.  Sets the Redux store
 *              for organization.
 * -----
 * Modified: 2019-03-23 15:10:01
 * Editor:   Darrin Tisdale
 */
import React from "react";
import { Redirect } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Typography from "@material-ui/core/Typography/index";
import Topbar from "../Topbar";
import { styles } from "../styles/MaterialSense";
import Card from "@material-ui/core/Card/index";
import CardContent from "@material-ui/core/CardContent/index";
import Grid from "@material-ui/core/Grid/index";
import SectionHeader from "../typo/SectionHeader";
import Button from "@material-ui/core/Button/index";
import InputLabel from "@material-ui/core/InputLabel/index";
import FormControl from "@material-ui/core/FormControl/index";
import MenuItem from "@material-ui/core/MenuItem/index";
import Select from "@material-ui/core/Select/index";
import { setOrg, store } from "../../redux";

class ClientOrg extends React.Component {
  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    id: "",
    organizations: [],
    org: "",
    orgId: 0,
    expanded: false,
    readyToRedirect: false,
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

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleSubmit(event) {
    event.preventDefault();
    console.log("ClientOrg.js, org selected is:" + this.state.orgId);
    let orgId = this.state.orgId;
    // Fetch the organization selected.
    fetch("/api/organizations/" + orgId)
      .then(response => {
        if (!response.ok) {
          // here, we get out of the then handlers and
          // over to the catch handler
          throw new Error("Network response was not ok.");
        } else {
          // status code 200 is success.
          console.log("ClientOrg.js, org selected. Status = 200");
          return response.json();
        }
      })
      .then(data => {
        store.dispatch(setOrg(JSON.stringify(data)));
        console.log("ClientOrg.js, organization:" + JSON.stringify(data));
      })
      .then(response => {
        this.setState({ readyToRedirect: true });
      })
      .catch(err => {
        // TODO - set error login on form.
      });
  }

  componentDidMount() {
    fetch("/api/organizations/?format=select")
      .then(results => results.json())
      .then(organizations => {
        this.setState({ organizations });
      });
  }

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;

    if (this.state.readyToRedirect) {
      return <Redirect to="/paneldashboard" />;
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
                        Select client organization
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

export default withStyles(styles)(ClientOrg);