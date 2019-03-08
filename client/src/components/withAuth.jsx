// withAuth.jsx
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { axios } from "axios";
import Log from "../util/Log";

export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false
      };
    }
    componentDidMount() {
      fetch("/api/validate")
        .then(res => {
          if (res.status === 200) {
            this.setState({ loading: false });
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, redirect: true });
        });
    }
    render() {
      const { loading, redirect } = this.state;

      if (redirect) {
        Log.trace("redirecting to login");
        return <Redirect to="/login" />;
      }

      Log.trace("withAuth -> returning React.Fragment");
      return (
        <React.Fragment>
          <ComponentToProtect {...this.props} />
        </React.Fragment>
      );
    }
  };
}
