// Login form using Formik.
//
import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import LoginFormContainer from './LoginFormContainer';
import {styles} from './MaterialSense';

// TODO - need to add a handleSubmit

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
    };

    render() {
        const {classes} = this.props;
        return (
            <LoginFormContainer children = {FormikLogin} classes={{classes}}/>
        );
    }
}

export default withRouter(withStyles(styles)(Login));

