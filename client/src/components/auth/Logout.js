// Login form using Formik.
//
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Typography from "@material-ui/core/Typography/index";
import Topbar from "../Topbar";
import { styles } from "../styles/MaterialSense";
import Card from "@material-ui/core/Card/index";
import CardContent from "@material-ui/core/CardContent/index";
import Grid from "@material-ui/core/Grid/index";
import SectionHeader from "../typo/SectionHeader";

class Logout extends Component {
  state = {
    order: "asc",
    orderBy: "name",
    orgs: []
  };

  componentDidMount() {
    // Authenticate against the username
    fetch("/api/auth/logout")
      .then(response => {
        if (response.status === 200) {
          // status code 200 is success.
        } else {
          // error
        }
      })
      .catch(err => {
        // TODO - set error login on form.
      });
  }

  render() {
    const { classes } = this.props;
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
                        You have been logged out.
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

export default withRouter(withStyles(styles)(Logout));
