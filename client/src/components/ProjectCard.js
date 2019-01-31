import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
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
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {getSorting, stableSort} from './TableFunctions';
import ProjectTitleSectionEditable from './project/ProjectTitleSectionEditable';
const materialstyles = theme => ({
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
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
});
var organizations = {};


const TitleSectionStatic = (classes, project) => {
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

class ProjectCard extends React.Component {
    state = {
        project: {},
        isEditing: false,
        isNew: false,
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
        } else {
            this.setState({isNew: true});
        }
    }


    render() {
        const {classes} = this.props;
        //const currentPath = this.props.location.pathname;

        /* react-router has injected the value of the attribute ID into the params */
        let id = this.props.match.params.id;
        alert('Title is:' + this.state.project.title);
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
                                                    <ProjectTitleSectionEditable
                                                        title="{this.state.project.title}"
                                                        projid="{this.props.match.params.id}"
                                                        orgid="{this.state.project.orgId}"/>
                                                </Grid>
                                                <Grid item xs={12} md={4}>

                                                    hi, this should be the {this.state.project.title} project.
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

export default withStyles(styles)(ProjectCard);