// List for editing persons, 1/22/19.
// Will be removed eventually.  Essentially a test harness for EditPerson.
import React, {Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Topbar from './Topbar';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {styles} from './MaterialSense';

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

class ListKpis extends Component {

    state = {
        order: 'asc',
        orderBy: '',
        selected: [],
        kpis: [],
    };

    componentDidMount() {
        // Use fetch to get all the KPIs
        fetch('/api/kpi')
            .then(res => res.json())
            .then(kpis => this.setState({kpis}));
    };


    render() {
        const {classes} = this.props;
        const mindmap = require('../images/mindmap-sample.png');

        return (
            <React.Fragment>
                <CssBaseline/>
                <Topbar/>
                <div className={classes.root}>
                    <Grid container justify="center">
                        <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
                            <Grid container item xs={12}>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <div align="center">
                                            <Typography variant="body1" gutterBottom>
                                                <Paper className={classes.root}>
                                                    <img width={1000} src={mindmap} />
                                                </Paper>
                                            </Typography>
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(ListKpis);

