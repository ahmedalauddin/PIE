/**
 * ProjectCard - add and edit projects component
 *
 * Uses Material UI controls, including simple select, see https://material-ui.com/demos/selects/.
 *
 */
import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Topbar from './Topbar';
//import ButtonBar from './buttons/ButtonBar';
//import Button from '@material-ui/core/Button';
import {styles} from './MaterialSense';
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
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
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
    // Just a placeholder for stuff we'll put in the expanding section.  Considering putting action items here.
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


const buttonstyles = theme => ({
    primary: {
        marginRight: theme.spacing.unit * 2
    },
    secondary: {
        background: theme.palette.secondary['100'],
        color: 'white'
    },
    spaceTop: {
        marginTop: 20
    }
});


class ProjectCard extends React.Component {
    // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
    // fields.
    state = {
        project: {},
        organizations: [],
        projid: 0,
        title: '',
        businessGoal: '',
        org: '',
        orgId: '',
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
        // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
        // state values.
        this.handleSubmit = this.handleSubmit.bind(this);
    }

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
                // alert('We have an ID, proj id = ' + this.state.id + ', title = ' + this.state.title);
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
    projectExists() {
        if (parseInt(this.props.match.params.id) > 0) {
            return(true);
        } else{
            return(false);
        }
    }

    componentDidMount() {
        if (this.projectExists) {
            fetch('/api/project/' + this.props.match.params.id)
                .then(res => res.json())
                .then(project => {
                    this.setState(
                        {
                            id: this.props.match.params.id,
                            businessGoal: project.businessGoal,
                            title: project.title,
                            description: project.description,
                            org: project.Organization.name,
                            orgId: project.orgId,
                            progress: project.progress,
                            startAt: moment(project.startAt).format('YYYY-MM-DD'),
                            endAt: moment(project.endAt).format('YYYY-MM-DD'),
                        });
                    //alert('project.orgId = ' + this.state.orgId + ', title = ' + this.state.title + ', org = ' + this.state.org);
                });
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
                <form onSubmit={this.handleSubmit} noValidate>
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
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{verticalAlign:'top',}}>
                                                        <Typography variant="h5" component="h2">
                                                            <TextField
                                                                required
                                                                id="standard-required"
                                                                label="Title"
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
                                                                    value={this.state.orgId}
                                                                    onChange={this.handleChange}
                                                                    renderValue={value => this.state.org}
                                                                    inputProps={{
                                                                        name: 'org',
                                                                        id: 'orgId',
                                                                    }}
                                                                >
                                                                    {stableSort(this.state.organizations, getSorting('asc', 'name'))
                                                                        .map(organizations => {
                                                                            return (
                                                                                <MenuItem value="{organizations.id}">{organizations.name}</MenuItem>
                                                                            );
                                                                        })}
                                                                </Select>
                                                            </FormControl>                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell style={{verticalAlign:'top', width: '55%'}}>
                                                        <Typography component="p">
                                                            <TextField
                                                                id="description"
                                                                label="Description"
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
                                                        <Typography component="p">
                                                            <TextField
                                                                id="businessGoal"
                                                                label="Business Goal"
                                                                multiline
                                                                rowsMax="4"
                                                                value={this.state.businessGoal}
                                                                onChange={this.handleChange('businessGoal')}
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
                                                                    id="startAt"
                                                                    label="Start Date"
                                                                    type="date"
                                                                    value={this.state.startAt}
                                                                    onChange={this.handleChange('startAt')}
                                                                    className={classes.textField}
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                />
                                                            </Typography>
                                                            <Typography variant="h6" gutterBottom>
                                                                <TextField
                                                                    id="endAt"
                                                                    label="End Date"
                                                                    type="date"
                                                                    value={this.state.endAt}
                                                                    onChange={this.handleChange('endAt')}
                                                                    className={classes.textField}
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                />
                                                            </Typography>
                                                            <Typography variant="h6" gutterBottom>
                                                                <Typography variant="h5" component="h2">
                                                                    <TextField
                                                                        id="standard-required"
                                                                        label="Progress"
                                                                        onChange={this.handleChange('progress')}
                                                                        value={this.state.progress}
                                                                        className={classes.textField}
                                                                        InputProps={{
                                                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                                        }}
                                                                    />
                                                                </Typography>
                                                            </Typography>
                                                            <div className={classes.spaceTop}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={this.handleSubmit}
                                                                    className={classes.secondary}
                                                                >
                                                                    Submit
                                                                </Button>
                                                            </div>
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