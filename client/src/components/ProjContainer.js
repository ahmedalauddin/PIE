import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import InstructionDialog from './dialogs/InstructionDialog';
import SwipeDialog from './dialogs/SwipeDialog';
import Topbar from './Topbar';
import ProjectTable from './ProjectTable';
import { styles } from './MaterialSense';
import { withFormik, Form, Field } from 'formik';
import Yup from 'yup';

const App = props => {
    const {
        values,
        errors,
        touched,
        handleChange,
        isSubmitting
    } = props;

    return (
        <div className="container">
            <Form>
                <div className="field">
                    <div className="control">
                        <label className="label">Title</label>
                        {touched.title && errors.title && <p>{errors.title}</p>}
                        <Field className="input" type="text" name="title" placeholder="Project title"/>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <label className="label">Description</label>
                        {touched.description && errors.description && <p>{errors.description}</p>}
                        <Field className="input" type="description" name="description" placeholder="Description"/>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <label className="label">Description</label>
                        {touched.orgId && errors.orgId && <p>{errors.orgId}</p>}
                        <Field className="input" type="orgId" name="orgId" placeholder="orgId"/>
                    </div>
                </div>


                <button disabled={isSubmitting}>Submit</button>

                <DisplayFormikState {...props} />
            </Form>
        </div>
    );
};


const DisplayFormikState = props =>
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
    </div>;


const FormikApp = withFormik({
    mapPropsToValues({title, description, orgId}) {
        return {
            title: title || '',
            description: description || '',
            orgId: orgId || '0'
        };
    },
    /*
    validationSchema: Yup.object().shape({
        //email: Yup.string().email('Email not valid').required('Email is required'),
        //fullname: Yup.string().required('Full Name is required!'),
        //password: Yup.string().min(9, 'Password must be 9 characters or longer').required('Password is required')
    }),
    */
    handleSubmit(values, {resetForm, setErrors, setSubmitting}) {
        alert(JSON.stringify(values));
        setTimeout(() => {
            fetch('/api/project', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values),
            }).then(function (data) {
                console.log(data);
            }).catch(function (err) {
                console.log(err);
            });
            setSubmitting(false);
        }, 2000);
    }
})(App);


class ProjContainer extends Component {
    constructor(props) {
        super();
    }

    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <CssBaseline/>
                <Topbar/>
                <div className={classes.root}>
                    <Grid container justify="center">
                        <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
                            <Grid container item xs={12}>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <div className={classes.box}>
                                            <Typography variant="body1" gutterBottom>
                                                <Paper className={classes.root}>
                                                    <FormikApp />
                                                </Paper>
                                            </Typography>
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(ProjContainer));