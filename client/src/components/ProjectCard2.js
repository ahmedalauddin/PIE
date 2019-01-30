import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import DescriptionIcon from '@material-ui/icons/Description';
import Topbar from './Topbar';
import ButtonBar from './buttons/ButtonBar';
import {styles} from './MaterialSense';

class ProjectCard2 extends React.Component {
    state = {
        project: '',
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const getUri = '/api/project/' + this.props.match.params.id;
        fetch(getUri)
            .then(res => res.json())
            .then(project => this.setState({project}));
    }


    render() {
        const { classes } = this.props;

        /* react-router has injected the value of the attribute ID into the params */
        let id = this.props.match.params.id;

        return (
            <React.Fragment>
                <CssBaseline/>
                <Topbar/>
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <div className={classes.itemContainer}>
                            <div className={classes.avatarContainer}>
                                <Avatar className={classes.avatar}>
                                    <DescriptionIcon />
                                </Avatar>
                            </div>
                            <div className={classes.baseline}>
                                <div className={classes.inline}>
                                    <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                                        Project
                                    </Typography>
                                    <Typography variant="h4" gutterBottom>
                                        {this.state.project.title}
                                    </Typography>
                                    <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                                        Description
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        {this.state.project.description}
                                    </Typography>
                                </div>
                                <div className={classes.inline}>
                                    <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                                        Organization
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        {this.state.project.Organization.name}
                                    </Typography>
                                </div>
                                <div className={classes.inline}>
                                    <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                                        Business Goal
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        {this.state.project.businessGoal}
                                    </Typography>
                                    <ButtonBar />
                                </div>
                            </div>
                            <div className={classes.inlineRight}>

                                <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                                    Start Date
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    {this.state.project.startAt}
                                </Typography>
                                <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                                    End Date
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    {this.state.project.endAt}
                                </Typography>
                                <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                                    Progress
                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                    {this.state.project.Progress}%
                                </Typography>
                                <Typography style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                                Status
                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                Complete
                                </Typography>

                            </div>
                        </div>
                    </Paper>
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(ProjectCard2);