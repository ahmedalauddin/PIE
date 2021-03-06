/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/withAuth.jsx
 * Created:  2019-02-01
 * Author:   Brad Kaufman
 * Descr:    Authorization component wrapping ComponentToProtect.
 * -----
 * Modified: 2019-03-17
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
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
      fetch("/api/auth/validate")
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
        Log.trace("withAuth -> redirecting to login");
        return <Redirect to="/login" />;
      }

      if (loading) {
        Log.trace("withAuth -> loading...continuing to render");
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
