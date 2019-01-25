import React from 'react';
import {Formik, FormikProps, Form, Field, ErrorMessage} from 'formik';
import { withRouter } from 'react-router-dom';

export class LoginForm extends React.Component {

    handleSubmit = (values, {
        props = this.props,
        setSubmitting
    }) => {
        console.log(values);
        setSubmitting(false);
        fetch('/signin', {
            method: 'POST',
            body: values,
        });
    }


    render() {
        return (
            <Formik
                initialValues={{
                    username: '',
                    email_address: '',
                    password: ''
                }}
                validate={(values) => {
                    let errors = [];

                    if (!values.email)
                        errors.email = "Email Address Required";

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
            />);
    }
}

export default withRouter(LoginForm);