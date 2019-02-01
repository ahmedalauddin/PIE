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
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {getSorting, stableSort} from './TableFunctions';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import moment from 'moment';
import Log from './Log';
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
    // Note that I'll need the individual fields for handleChange.
    state = {
        project: {},
        organizations: [],
        projid: 0,
        title: '',
        goal: '',
        org: '',
        description: '',
        startAt: '',
        endAt: '',
        progress: 0,
        isEditing: false,
        isNew: false,
        expanded: false,
        labelWidth: 0,
    };


    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /*
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    */

    handleChange = name => event => {
        this.setState({[name]: event.target.value,});
    };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    //handleSubmit(values, {resetForm, setErrors, setSubmitting}) {
    handleSubmit(event) {
        event.preventDefault();

        setTimeout(() => {
            if (this.state.id > 0) {
                alert('We have an ID');
                // We have a project id passed through the URL, do an
                // update on the project.
                let updatePath = '/api/project/' + this.state.id;
                fetch(updatePath, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(this.state),
                }).then(function (data) {
                    //console.log(data);
                }).catch(function (err) {
                    //console.log(err);
                });
            } else {
                // No project id, so we will do a create.  The difference
                // is we do a POST instead of a PUT.
                fetch('/api/project', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(this.state),
                }).then(function (data) {
                    //console.log(data);
                }).catch(function (err) {
                    //console.log(err);
                });
            }

            //setSubmitting(false);
        }, 2000);
    }

    // Return boolean for whether the project exists.
    doesProjectExist() {

    }

    componentDidMount() {
        if (parseInt(this.props.match.params.id) > 0) {
            fetch('/api/project/' + this.props.match.params.id)
                .then(res => res.json())
                .then(project => this.setState(
                    {id:  this.props.match.params.id,
                        goal: project.businessGoal,
                        title: project.title,
                        description: project.description,
                        org: project.Organization.name,
                        orgId: project.orgId,
                        progress: project.progress,
                        startAt: moment(project.startAt).format('YYYY-MM-DD'),
                        endAt: project.endAt,
                    }));
        } else {
            this.setState({isEditing: true});
        }
        // Have to set the state of the individual fields for the handleChange function for the TextFields.
        // Do this using the project state.

        fetch('/api/organizations/')
            .then(results => results.json())
            .then(organizations => this.setState({organizations}));
        //this.setState({
        //labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,});
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
                <form onSubmit={this.handleSubmit}>
                    <div className={classes.root}>
                        <Grid container justify="center">
                            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
                                <Grid item xs={12}>
                                    <SectionHeader title="" subtitle="" />
                                    <Card className={classes.card}>
                                        <CardContent>
                                            <Table>
                                                <TableRow>
                                                    <TableCell style={{verticalAlign:'top',}}>
                                                        <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                                                                Project
                                                        </Typography>
                                                        <Typography variant="h5" component="h2">
                                                            <TextField
                                                                required
                                                                id="standard-required"
                                                                label="Project"
                                                                onChange={this.handleChange('title')}
                                                                value={this.state.title}
                                                                className={classes.textField}
                                                                margin="normal"
                                                            />
                                                        </Typography>
                                                        <Typography variant="h5" component="h2">
                                                            <FormControl className={classes.formControl}>
                                                                <InputLabel htmlFor="organization-simple">Organization</InputLabel>
                                                                <Select
                                                                    value={this.state.org}
                                                                    onChange={this.handleChange}
                                                                    inputProps={{
                                                                        name: 'org',
                                                                        id: 'org',
                                                                    }}
                                                                >
                                                                    <MenuItem value="">
                                                                        None
                                                                    </MenuItem>
                                                                    {stableSort(this.state.organizations, getSorting('asc', 'name'))
                                                                        .map(organizations => {
                                                                            return (
                                                                                <MenuItem value="{organizations.id}">{organizations.name}</MenuItem>
                                                                            );
                                                                        })}
                                                                </Select>
                                                            </FormControl>
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell style={{verticalAlign:'top', width: '55%'}}>
                                                        <Typography style={{textTransform: 'uppercase'}} color="secondary" gutterBottom>
                                                                Description
                                                        </Typography>
                                                        <Typography component="p">
                                                            <TextField
                                                                id="description"
                                                                label=""
                                                                multiline
                                                                rowsMax="6"
                                                                value={this.state.description}
                                                                onChange={this.handleChange('description')}
                                                                className={classes.textField}
                                                                fullWidth
                                                                margin="normal"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </Typography>
                                                        <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                                                                Business Goal
                                                        </Typography>
                                                        <Typography component="p">
                                                            <TextField
                                                                id="goal"
                                                                label=""
                                                                multiline
                                                                rowsMax="4"
                                                                value={this.state.goal}
                                                                onChange={this.handleChange('goal')}
                                                                className={classes.textField}
                                                                fullWidth
                                                                margin="normal"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                            />
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell style={{verticalAlign:'top', width: '25%'}}>
                                                        <div className={classes.inlineRight}>
                                                            <Typography variant="h6" gutterBottom>
                                                                <TextField
                                                                    id="startdate"
                                                                    label="Start Date"
                                                                    type="date"
                                                                    defaultValue={this.state.startAt}
                                                                    className={classes.textField}
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                />
                                                            </Typography>
                                                            <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                                                                End Date
                                                            </Typography>
                                                            <Typography variant="h6" gutterBottom>
                                                                <Moment format="D MMM YYYY" withTitle>
                                                                    {this.state.endAt}
                                                                </Moment>
                                                            </Typography>
                                                            <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                                                                Progress
                                                            </Typography>
                                                            <Typography variant="h6" gutterBottom>
                                                                {this.state.progress}%
                                                            </Typography>
                                                            <ButtonBar/>
                                                            <button onClick={this.handleSubmit}>Submit</button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            </Table>

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
                </form>
            </React.Fragment>
        );
    }
}


export default withStyles(styles)(ProjectCard);