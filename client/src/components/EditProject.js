// Simpler version of edit project, 1/22/19.
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Topbar from './Topbar';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {styles} from './MaterialSense';

class EditProject extends React.Component {
    state = {
        project: '',
    };

    componentDidMount() {
        if (this.props.match.params.id != '') {

            const url1 = '/api/project/' + this.props.match.params.id;
            //if (projid > 0) {
            fetch(url1)
                .then(res => res.json())
                .then(project => this.setState({project}));
            //}
        }
    }


    render() {
        const {classes} = this.props;

        /* react-router has injected the value of the attribute ID into the params */
        let id = this.props.match.params.id;

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
                                        <form>
                                            <Typography variant="body1" gutterBottom>
                                                <label htmlFor="title">Project title</label><br/>
                                                <input id="title" name="title" type="text" value={this.state.project.title}/>
                                            </Typography>

                                            <Typography variant="body1" gutterBottom>
                                                <label htmlFor="description">Description</label><br/>
                                                <input id="description" name="description" type="description" value={this.state.project.description}/>
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                                <label htmlFor="progress">Progress</label><br/>
                                                <input id="progress" name="progress" type="text" value={this.state.project.progress}/>
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                                <label htmlFor="startDate">Start date</label><br/>
                                                <input id="startDate" name="startDate" type="text" value={this.state.project.startDate}/>
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                                <button>Submit</button>
                                            </Typography>

                                        </form>
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


export default withStyles(styles)(EditProject);

