import React from "react";
import { render } from "react-dom";
import { withFormik } from "formik";
import Yup from "yup";

/*
// Debugging information for Formik.
export const DisplayFormikState = props => (
    <div style={{ margin: '1rem 0' }}>
        <h3 style={{ fontFamily: 'monospace' }} />
        <pre
            style={{
                background: '#f6f8fa',
                fontSize: '.65rem',
                padding: '.5rem',
            }}
        >
      <strong>props</strong> ={' '}
            {JSON.stringify(props, null, 2)}
    </pre>
    </div>
);
*/

class MyForm extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.user.title !== this.props.user.title) {
      this.props.resetForm(nextProps);
    }
  }

  componentDidMount() {
    fetch("/api/project")
      .then(res => res.json())
      .then(project => this.setState({ project }));
  }

  updateProject = project => {
    this.setState({ project });
    // This is where I should call the API method.
  };

  render() {
    // notice how touched will reset when the user changes
    console.log(this.props.touched);
    return (
      <form onSubmit={this.props.handleSubmit}>
        <label htmlFor="email">Project Title</label>

        <button type="submit" disabled={this.props.isSubmitting}>
          Submit
        </button>
      </form>
    );
  }
}

class EditProjectFormik extends React.Component {
  state = {
    project: {
      id: 7,
      title: "Reduce inefficiency",
      description:
        "Reduce inefficiency of Northestern plants over the next nine months"
    }
  };

  updateProject = project => {
    this.setState({ project });
  };

  render() {
    return (
      <div className="app">
        <h1>Formik Edit Project Example</h1>

        <MyForm user={this.state.project} updateProject={this.updateProject} />
        <h3 style={{ fontWeight: "bold", marginBottom: 0 }}>
          Click the button below to pass different props to the form
        </h3>
        <button
          style={{ width: "100%", maxWidth: "250px" }}
          onClick={() =>
            this.setState({
              user: { email: "hello@reason.nyc" }
            })
          }
        >
          > > Change Props and Reset
        </button>
      </div>
    );
  }
}
render(<EditProjectFormik />, document.getElementById("root"));

export default EditProjectFormik;
