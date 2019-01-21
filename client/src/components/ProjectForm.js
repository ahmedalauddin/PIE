// Formik Basic example, renamed for ProjectForm.
import React from 'react';
import {Formik, Field, Form} from 'formik';
import {Debug} from './Debug';
import CssBaseline from "./Dashboard";
import Topbar from "./Topbar";
import Grid from "@material-ui/core/Grid";

const ProjectForm = () => (
    <div>
        <CssBaseline/>
        <Topbar/>
        <div className={classes.root}>
            <Grid container justify="center">
                <h1>Sign Up</h1>
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                    }}
                    onSubmit={values => {
                        setTimeout(() => {
                            alert(JSON.stringify(values, null, 2));
                        }, 500);
                    }}
                    render={() => (
                        <Form>
                            <label htmlFor="firstName">First Name</label>
                            <Field name="firstName" placeholder="Jane"/>

                            <label htmlFor="lastName">Last Name</label>
                            <Field name="lastName" placeholder="Doe"/>

                            <label htmlFor="email">Email</label>
                            <Field name="email" placeholder="jane@acme.com" type="email"/>
                            <button type="submit">Submit</button>
                            <Debug/>
                        </Form>
                    )}
                />
                /Grid>
            </Grid>
        </div>
    </div>
);

export default ProjectForm;