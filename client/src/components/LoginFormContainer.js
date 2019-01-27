import React from 'react';
import Topbar from './Topbar';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {styles, backgroundShape} from './MaterialSense';

class LoginFormContainer extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        const {classes} = this.props;
        return (
            <div className="wrapper">
                <CssBaseline/>
                <Topbar/>
                <div className={classes.root}>
                    <Grid container justify="center">
                        <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
                            <Grid container item xs={12}>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <div>
                                            <div className={classes.box}>
                                                <Typography variant="body2" gutterBottom>
                                                    {this.props.children}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}


export default withRouter(withStyles(styles)(LoginFormContainer));