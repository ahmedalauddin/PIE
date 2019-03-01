// withAuth.jsx
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';


export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }
    componentDidMount() {
      fetch('/validateToken')
        .then(res => {
          this.setState({ loading: false });
          //alert(`returning from checkToken -> success, res.status: ${res.status}`);
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
      /*
      TODO - Check if we need loading

      if (loading) {
        return null;
      }
      */

      //alert(`returning from checkToken -> check redeirect`);
      if (redirect) {
        return <Redirect to="/login" />;
      }
      //alert(`returning from checkToken -> will return React.Fragment`);
      return (
        <React.Fragment>
          <ComponentToProtect {...this.props} />
        </React.Fragment>
      );
    }
  }
}