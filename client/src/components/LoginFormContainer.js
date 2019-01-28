import React from 'react';
import Topbar from './Topbar';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {styles} from './MaterialSense';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import validate from './validate-spected';
import getValidationSchema from './getValidationSchema-spected';


const initialValues = {
    email: 'brad@th.io',
    password: 'ssssssss',
    username: 'bk12',
    lastName: 'Kaufman',
    firstName: 'BK',
    fullName: 'Brad Kaufman',
    passwordConfirmation: 'ssssssss'
}

function SignUpForm(props) {
    const { isSubmitting, errors, handleChange, handleSubmit } = props

    return (
        <div className="form">
            <label className="form-field" htmlFor="email">
                <span>Email:</span><br/>
                <input name="email" type="email" onChange={handleChange} />
            </label>
            <div className="form-field-error">{errors.email}</div>

            <label className="form-field" htmlFor="username">
                <span>Username:</span><br/>
                <input name="username" type="text" onChange={handleChange} />
            </label>
            <div className="form-field-error">{errors.username}</div>

            <label className="form-field" htmlFor="fullName">
                <span>Full Name:</span><br/>
                <input name="fullName" type="text" onChange={handleChange} />
            </label>
            <div className="form-field-error">{errors.fullName}</div>

            <label className="form-field" htmlFor="orgId">
                <span>Org ID:</span><br/>
                <input name="orgId" type="text" onChange={handleChange} />
            </label>
            <div className="form-field-error">{errors.orgId}</div>

            <label className="form-field" htmlFor="password">
                <span>Password:</span><br/>
                <input name="password" type="password" onChange={handleChange} />
            </label>
            <div className="form-field-error">{errors.password}</div>

            <label className="form-field" htmlFor="passwordConfirmation">
                <span>Confirm password:</span><br/>
                <input name="passwordConfirmation" type="password" onChange={handleChange} />
            </label>
            <div className="form-field-error">{errors.passwordConfirmation}</div>


            <button onClick={handleSubmit}>{isSubmitting ? 'Loading' : 'Sign Up'}</button>
        </div>
    );
}

function setSubmitValues(values) {
    let email = values.email;
    let pwdhash = values.password;
    let organization = values.organization;
    let username = values.username;
    let firstname = values.firstname;
    let lastname = values.lastname;
    var myvalues = {email: email, orgId: organization, pwdhash: pwdhash, username: username, firstName: firstname, lastName: lastname };
    return(myvalues);
}

function onSubmit(values, { setSubmitting, setErrors }) {

    setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);

        var myValues = setSubmitValues(values);


        //myValues = JSON.stringify(myValues);

        //alert(values('email'));
        fetch('/api/person', {
            method: 'POST',
            body: JSON.stringify({
                myValues
            }),
            headers: {"Content-Type": "application/json"}
        }).then(function (data) {
            console.log(data);
        }).catch(function (err) {
            console.log(err);
        });

    }, 2000);
}


class LoginFormContainer extends React.Component {
    constructor(props) {
        super();
        this.state = { children: '' };
    }

    componentDidMount() {
        this.setState({children: SignUpForm});
    }

    render() {
        const {classes} = this.props;

        return (
            <div className="wrapper">
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
                                                    <Formik
                                                        initialValues={initialValues}
                                                        validate={validate(getValidationSchema)}
                                                        onSubmit={onSubmit}
                                                        render={SignUpForm}
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


export default withRouter(withStyles(styles)(LoginFormContainer));