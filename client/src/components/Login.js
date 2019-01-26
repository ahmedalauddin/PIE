// Login form using Formik.
//
import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Topbar from './Topbar';
import {ErrorMessage, Field, Form, Formik} from 'formik';

const backgroundShape = require('../images/shape.svg');
const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.grey['100'],
        overflow: 'hidden',
        background: `url(${backgroundShape}) no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: '0 400px',
        paddingBottom: 200
    },
    grid: {
        width: 1200,
        marginTop: 40,
        [theme.breakpoints.down('sm')]: {
            width: 'calc(100% - 20px)'
        }
    },
    paper: {
        padding: theme.spacing.unit * 3,
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
    rangeLabel: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: theme.spacing.unit * 2
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 32
    },
    outlinedButton: {
        textTransform: 'uppercase',
        margin: theme.spacing.unit
    },
    actionButton: {
        textTransform: 'uppercase',
        margin: theme.spacing.unit,
        width: 152
    },
    blockCenter: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center'
    },
    block: {
        padding: theme.spacing.unit * 2,
    },
    box: {
        marginBottom: 40,
        height: 65
    },
    inlining: {
        display: 'inline-block',
        marginRight: 10
    },
    buttonBar: {
        display: 'flex'
    },
    alignRight: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    noBorder: {
        borderBottomStyle: 'hidden'
    },
    loadingState: {
        opacity: 0.05
    },
    loadingMessage: {
        position: 'absolute',
        top: '40%',
        left: '40%'
    }
});

const Layout = ({children, classes}) => (
    <div className="wrapper">
        <CssBaseline/>
        <Topbar/>
        <div className={classes.root}>
            <Grid container justify="center">
                <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
                    <Grid container item xs={12}>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <div>
                                    <div className={classes.box}>
                                        <Typography variant="body2" gutterBottom>
                                            {children}
                                        </Typography>
                                    </div>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    </div>
);

const FormikLogin = (
    <Formik
        initialValues={{
            username: '',
            email_address: '',
            password: ''
        }}
        validate={(values) => {
            let errors = [];

            if (!values.email)
                errors.email = 'Email Address Required';

            //check if my values have errors
            return errors;
        }}
        onSubmit={this.handleSubmit}
        render={formProps => {
            return (
                <Form>
                    <label htmlFor="username">Username</label><br/>
                    <Field
                        type="text"
                        name="username"
                        placeholder="Username"
                    />
                    <ErrorMessage name="first_name"/><br/><br/>

                    <label htmlFor="username">Username</label><br/>
                    <Field
                        type="text"
                        name="email"
                        placeholder="Email address"
                    />
                    <ErrorMessage name="email"/><br/>

                    <label htmlFor="password">Password</label><br/>
                    <Field
                        type="password"
                        name="password"
                        placeholder=""/>
                    <ErrorMessage name="password"/><br/><br/>

                    <button
                        type="submit"
                        disabled={formProps.isSubmitting}>
                        Login
                    </button><br/>
                </Form>
            );
        }}
    />
);

class Login extends Component {
    state = {
        order: 'asc',
        orderBy: 'name',
        orgs: [],
        learnMoredialog: false,
        getStartedDialog: false
    };

    render() {
        return (
            <Layout>
                <FormikLogin/>
            </Layout>
        );
    }
}

export default withRouter(withStyles(styles)(Login));