// mindmap component
import React, {Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Topbar from './Topbar';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {styles} from './MaterialSense';
import {jsMind} from './mindmap/jsmind';
import './mindmap/mindmap.css';

// TODO add hooks on mindmap object to call component functions exposed and passed in via extended options
// TODO determine if we are going to use Flux to handle message routing because including the toolbar here is crap
// TODO extend the rendition part of the node to include a link to the project if it's present

class Mindmap extends Component {

    state = {
        mindmapId: 0,
        mindmapData: []
    };

    componentDidMount() {
        // check to see if props includes the ID to the mindmap
        if(this.props.mindmapId)
        {
            // Use fetch to get all the KPIs
            fetch('/api/mindmap/')
                .then(res => res.json())
                .then(mindmap => this.setState({mindmap}));
        }
    }

    componentDidUpdate() {
        // set up the options
        let options = {
            container: 'mindmap',
            theme: 'green',
            editable: true
        };
        let jm = new jsMind(options);
        jm.show(this.state.mindmapData);
    }

    render() {
        const {classes} = this.props.classes;

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
                                                    <div id="mindmap"></div>
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
        );
    }
}

export default withStyles(styles)(Mindmap);

