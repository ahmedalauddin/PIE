// Login form using Formik.
//
import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Topbar from './Topbar';
import LoginFormContainer from './LoginFormContainer';

class Logout extends Component {

    render() {
        return (
            <Layout>
                <LoginForm/>
            </Layout>
        );
    }
}

export default withRouter(withStyles(styles)(Logout));