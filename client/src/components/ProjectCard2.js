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
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import SectionHeader from './typo/SectionHeader';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Collapse from '@material-ui/core/Collapse';
import classnames from 'classnames';
import {red} from '@material-ui/core/colors';
import Moment from 'react-moment';

const cardstyles = theme => ({
    card: {
        maxWidth: 400,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
});

const TitleSectionGridItem = (classes, project) => {
    return (
        <div className={classes.inline}>
            <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                Project
            </Typography>
            <Typography variant="h5" component="h2">
                {project.title}<br/><br/>
            </Typography>
        </div>
    );
};

const DescriptionSectionGridItem = (classes, project) => {
    return (
        <div className={classes.inline}>
            <Typography style={{textTransform: 'uppercase'}} color="secondary" gutterBottom>
                Description
            </Typography>
            <Typography component="p">
                {project.description}<br/><br/>
            </Typography>
            <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                Business Goal
            </Typography>
            <Typography component="p">
                {project.businessGoal}<br/><br/>
            </Typography>
        </div>
    );
};

const RightSectionGridItem = (classes, project) => {
    return (
        <div className={classes.inlineRight}>
            <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                Start Date
            </Typography>
            <Typography variant="h6" gutterBottom>
                <Moment format="D MMM YYYY" withTitle>
                    {project.startAt}
                </Moment>
            </Typography>
            <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                End Date
            </Typography>
            <Typography variant="h6" gutterBottom>
                <Moment format="D MMM YYYY" withTitle>
                    {project.endAt}
                </Moment>
            </Typography>
            <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                Progress
            </Typography>
            <Typography variant="h6" gutterBottom>
                {project.progress}%
            </Typography>
            <ButtonBar/>
        </div>
    );
};

const ExpandingSectionGridItem = (classes, project) => {
    return (
        <div className={classes.inlineLeft}>
            <Typography variant="h6" style={{ textTransform: 'uppercase' }} color='secondary' gutterBottom>
                Other Prioritized KPIs
            </Typography>
            <Typography variant="h5" gutterBottom>
                Service BOM Accuracy
            </Typography>
            <Typography variant="h7" gutterBottom>
                Leading KPI<br/>Project started 12 February 2018<br/><br/>
            </Typography>
            <Typography variant="h5" gutterBottom>
                Reduction in Unplanned Activities
            </Typography>
            <Typography variant="h7" gutterBottom>
                Leading KPI<br/>Project started 14 March 2018<br/><br/>
            </Typography>
            <Typography variant="h5" gutterBottom>
                Increase in Local Source
            </Typography>
            <Typography variant="h7" gutterBottom>
                Leading KPI<br/>Project started 14 March 2018<br/><br/>
            </Typography>
            <Typography variant="h5"  gutterBottom>
                Improve Predictablity of Failure
            </Typography>
            <Typography variant="h7" gutterBottom>
                Leading KPI<br/>Project in planning<br/><br/>
            </Typography>
            <Typography variant="h5"  gutterBottom>
                First Time Right
            </Typography>
            <Typography variant="h7" gutterBottom>
                Leading KPI<br/>Project in planning<br/><br/><br/>
            </Typography>
        </div>
    );
};


class ProjectCard2 extends React.Component {
    state = {
        project: '',
        expanded: false
    };

    constructor(props) {
        super(props);
    }

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    componentDidMount() {
        if (parseInt(this.props.match.params.id) > 0) {
            const getUri = '/api/project/' + this.props.match.params.id;
            fetch(getUri)
                .then(res => res.json())
                .then(project => this.setState({project}));
        }
    }

    render() {
        const {classes} = this.props;
        //const currentPath = this.props.location.pathname;

        /* react-router has injected the value of the attribute ID into the params */
        let id = this.props.match.params.id;

        return (
            <React.Fragment>
                <CssBaseline />
                <Topbar />

                <div className={classes.root}>
                    <Grid container justify="center">
                        <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
                            <Grid item xs={12}>
                                <SectionHeader title="Project Details" subtitle="" />
                                <Card className={classes.card}>
                                    <CardContent>
                                        <Grid container justify="center">
                                            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
                                                <Grid item xs={12} md={4}>
                                                    {TitleSectionGridItem(classes, this.state.project)}
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    {DescriptionSectionGridItem(classes, this.state.project)}
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    {RightSectionGridItem(classes, this.state.project)}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardActions className={classes.actions} disableActionSpacing>
                                        <IconButton
                                            className={classnames(classes.expand, {
                                                [classes.expandOpen]: this.state.expanded,
                                            })}
                                            onClick={this.handleExpandClick}
                                            aria-expanded={this.state.expanded}
                                            aria-label="Show more"
                                        >
                                            <ExpandMoreIcon />
                                        </IconButton>
                                    </CardActions>
                                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                                        <CardContent>
                                            {ExpandingSectionGridItem(classes, this.state.project)}
                                        </CardContent>
                                    </Collapse>

                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </React.Fragment>
        );
    }
}



function ProjectSection(props) {
    const {classes} = props;
    return (
        <div className={classes.baseline}>
            <div className={classes.inline}>
                <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                    Project
                </Typography>
                <Typography variant="h4" gutterBottom>
                    {this.state.project.title}
                </Typography>
                <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                    Description
                </Typography>
                <Typography variant="h6" gutterBottom>
                    {this.state.project.description}
                </Typography>
            </div>
            <div className={classes.inline}>
                <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                    Organization
                </Typography>
                <Typography variant="h6" gutterBottom>
                    {this.state.project.name}
                </Typography>
            </div>
            <div className={classes.inline}>
                <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                    Business Goal
                </Typography>
                <Typography variant="h6" gutterBottom>
                    {this.state.project.businessGoal}
                </Typography>
                <ButtonBar/>
            </div>
        </div>
    );
}

export default withStyles(styles)(ProjectCard2);