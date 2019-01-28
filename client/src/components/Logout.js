// Login form using Formik.
//
import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom';

import LoginFormContainer from './LoginFormContainer';
import {styles} from './MaterialSense';


const LogoutMessage = (
    <h2>You have been logged out.  Click here to login again.</h2>
);

class Logout extends Component {
    state = {
        order: 'asc',
        orderBy: 'name',
        orgs: [],
    };

    render() {
        return (
            <LoginFormContainer children = {LogoutMessage} />
        );
    }
}

export default withRouter(withStyles(styles)(Logout));