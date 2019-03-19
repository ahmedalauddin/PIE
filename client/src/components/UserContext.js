/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/UserContext.js
 * Created:  2019-03-17
 * Author:   Brad Kaufman
 * Descr:    User Context using React's Context API.
 * -----
 * Modified: 2019-03-19 12:25:24
 * Editor:   Darrin Tisdale
 */
import React, { Component } from "react";

/**
 * *UserContext*
 * the context that stores information
 */
export const UserContext = React.createContext({
  user: {},
  organization: {},
  setUser: user => {},
  setOrg: organization => {}
});

/**
 * *UserConsumer*
 * the consumer for the context
 */
export const UserConsumer = UserContext.Consumer;

/**
 * *UserProvider*
 * a provider for the UserContext
 *
 * @export
 * @class UserProvider
 * @extends {Component}
 */
export class UserProvider extends Component {
  /**
   * Creates an instance of UserProvider
   * @param {*} props
   * @memberof UserProvider
   */
  constructor(props) {
    super(props);

    // defines the state of the component
    this.state = {
      user: {},
      organization: {},
      // since we are in the state, we can create
      // a member function here and not require
      // a bind as used in other times
      // NOTE: this approach ensures all other elements remain the same
      setUser: u => {
        this.setState({ ...this.state, user: u });
      },
      setOrg: o => {
        this.setState({ ...this.state, organization: o });
      }
    };
  }

  /**
   * Renders the UserContext provider
   *
   * @returns an instance of the provider for UserContext
   * @memberof UserProvider
   */
  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
