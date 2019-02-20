// Testing project create using Formik.
import React from "react";
import Topbar from "../Topbar";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { styles } from "../MaterialSense";
import { Form, Formik } from "formik";
import { Debug } from "../Debug";

function ProjectForm(props) {
  const { isSubmitting, errors, handleChange } = props;

  function handleSubmit(values, { setSubmitting, setErrors }) {
    //var myvalues = JSON.stringify(values)

    fetch("/api/project", {
      method: "POST",
      body: values
    })
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  /*
    const DisplayFormikState = props => {

        <div style={{margin: '1rem 0', background: '#f6f8fa', padding: '.5rem'}}>
            <strong>Injected Formik props (the form's state)</strong>
            <div>
                <code>errors:</code> {JSON.stringify(props.errors, null, 2)}
            </div>
            <div>
                <code>values:</code> {JSON.stringify(props.values, null, 2)}
            </div>
            <div>
                <code>isSubmitting:</code> {JSON.stringify(props.isSubmitting, null, 2)}
            </div>
        </div>

    }; */

  return (
    <Formik
      id="formik-form"
      name="formik-form"
      render={() => (
        <Form>
          <Typography variant="body1" gutterBottom>
            <label className="form-field" htmlFor="title">
              Project title
            </label>
            <br />
            <input
              id="title"
              name="title"
              onChange={handleChange}
              type="text"
            />
          </Typography>

          <Typography variant="body1" gutterBottom>
            <label className="form-field" htmlFor="description">
              Description
            </label>
            <br />
            <input
              id="description"
              name="description"
              onChange={handleChange}
              type="text"
            />
          </Typography>

          <Typography variant="body2" gutterBottom>
            <label className="form-field" htmlFor="progress">
              Progress
            </label>
            <br />
            <input
              id="progress"
              name="progress"
              onChange={handleChange}
              type="text"
            />
          </Typography>

          <Typography variant="body2" gutterBottom>
            <label className="form-field" htmlFor="startDate">
              Start date
            </label>
            <br />
            <input
              id="startDate"
              name="startDate"
              onChange={handleChange}
              type="date"
            />
          </Typography>

          <Typography variant="body2" gutterBottom>
            <label className="form-field" htmlFor="endDate">
              End date
            </label>
            <br />
            <input
              id="endDate"
              name="endDate"
              onChange={handleChange}
              type="date"
            />
          </Typography>

          <Typography variant="body2" gutterBottom>
            <button onClick={handleSubmit}>
              {isSubmitting ? "Loading" : "Add Project"}
            </button>
          </Typography>

          <Debug />
        </Form>
      )}
    />
  );
}

class ProjectContainer extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="wrapper">
        <CssBaseline />
        <Topbar />
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid
              spacing={24}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid container item xs={12}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <div className={classes.box}>
                      <Typography variant="body1" gutterBottom>
                        <Paper className={classes.root}>
                          <Formik
                            onSubmit={ProjectForm.handleSubmit}
                            render={ProjectForm}
                          />
                        </Paper>
                      </Typography>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(ProjectContainer));
