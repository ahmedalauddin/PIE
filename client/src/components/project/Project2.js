import React from "react";
import { render } from "react-dom";
import { withFormik, Form, Field } from "formik";
import Yup from "yup";

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

        <button disabled={isSubmitting}>Submit</button>

        <DisplayFormikState {...props} />
      </Form>
    </div>
  );
};

const DisplayFormikState = props => (
  <div style={{ margin: "1rem 0", background: "#f6f8fa", padding: ".5rem" }}>
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
  mapPropsToValues({title, description}) {
    return {
      email: title || '',
      password: description || ''
    };
  },
  validationSchema: Yup.object().shape({
    //email: Yup.string().email('Email not valid').required('Email is required'),
    //fullname: Yup.string().required('Full Name is required!'),
    //password: Yup.string().min(9, 'Password must be 9 characters or longer').required('Password is required')
  }),
  handleSubmit(values, {resetForm, setErrors, setSubmitting}) {
    setTimeout(() => {
      fetch('/api/project', {
        method: 'POST',
        body: values,
      }).then(function (data) {
          console.log(data);
      }).catch(function (err) {
          console.log(err);
      });
      setSubmitting(false);
    }, 2000);
  }
})(App);

render(<FormikApp />, document.getElementById("root"));
