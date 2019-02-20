import React from "react";
import { Formik, FormikProps, Form, Field, ErrorMessage } from "formik";
import { withRouter } from "react-router-dom";

export class SignupOld extends React.Component {
  handleSubmit = (values, { props = this.props, setSubmitting }) => {
    console.log(values);
    alert("Form Submitted");
    setSubmitting(false);
    this.props.history.push("/listprojects");
  };

  componentDidMount() {
    const url1 = "/api/person/" + this.props.match.params.id;
    //if (projid > 0) {
    fetch(url1)
      .then(res => res.json())
      .then(person => this.setState({ person }));
    //}
  }

  handleLogin = (values, { props = this.props }) => {
    const url1 = "/api/auth/" + this.props.match.params.id;
    //if (projid > 0) {
    fetch(url1)
      .then(res => res.json())
      .then(person => this.setState({ person }));
  };

  render() {
    return (
      <Formik
        initialValues={{
          username: "",
          email_address: "",
          password: ""
        }}
        validate={values => {
          const errors = [];

          if (!values.email) {
            errors.email = "Email Address Required";
          }

          //check if my values have errors
          return errors;
        }}
        onSubmit={this.handleSubmit}
        render={formProps => {
          return (
            <Form>
              <Field type="text" name="username" placeholder="Username" />
              <ErrorMessage name="username" />

              <Field type="text" name="email" placeholder="Email address" />
              <ErrorMessage name="email" />

              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" />

              <Field
                type="password"
                name="confirmpassword"
                placeholder="confirmpassword"
              />
              <ErrorMessage name="confirmpassword" />

              <button type="submit" disabled={formProps.isSubmitting}>
                Submit Form
              </button>
            </Form>
          );
        }}
      />
    );
  }
}

export default withRouter(SignupOld);
