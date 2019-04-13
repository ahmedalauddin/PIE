/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/About.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-24
 * Editor:   Brad Kaufman
 * Notes:
 */
import React from "react";
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
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import { getOrgId, getOrgName } from "../redux";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

class About extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    task: {},
    projectId: 0,
    title: ""
  };

  componentDidMount() {

  }

  render() {
    const { classes, location } = this.props;
    const currentPath = location ? location.pathname : "/";

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath} />
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
                <Grid item xs={4}>
                  <SectionHeader title="" subtitle="" />
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        color="secondary"
                        gutterBottom
                      >
                        About the ValueInfinity Innovation Platform<br/><br/>
                      </Typography>
                      <div>
                        <Typography variant="body2">
                          Version: 0.6.11
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body2">
                          Build date: April 12, 2019<br/><br/>
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body2">
                          Notes: Introducing departments on the organization card.  Departments will also be listed
                          from a dropdown menu on the KPI card.  Also adding a placeholder for a description of formula for a KPI.
                        </Typography>
                      </div>
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

export default withStyles(styles)(About);
