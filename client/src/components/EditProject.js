// Simpler version of edit project, 1/22/19.
import React, {Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Topbar from './Topbar';
import Grid from '@material-ui/core/Grid';
import {withRouter} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.grey['100'],
        overflow: 'hidden',
        background: '',
        backgroundSize: 'cover',
        backgroundPosition: '0 400px',
        paddingBottom: 200
    },
    grid: {
        width: 1200,
        marginTop: 40,
        [theme.breakpoints.down('sm')]: {
            width: 'calc(100% - 20px)'
        }
    },
    paper: {
        padding: theme.spacing.unit * 3,
        textAlign: 'left',
        color: theme.palette.text.secondary,
    },
    rangeLabel: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: theme.spacing.unit * 2
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 32
    },
    outlinedButtom: {
        textTransform: 'uppercase',
        margin: theme.spacing.unit
    },
    actionButtom: {
        textTransform: 'uppercase',
        margin: theme.spacing.unit,
        width: 152
    },
    blockCenter: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center'
    },
    block: {
        padding: theme.spacing.unit * 2,
    },
    box: {
        marginBottom: 40,
        height: 65
    },
    inlining: {
        display: 'inline-block',
        marginRight: 10
    },
    buttonBar: {
        display: 'flex'
    },
    alignRight: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    noBorder: {
        borderBottomStyle: 'hidden'
    },
    loadingState: {
        opacity: 0.05
    },
    loadingMessage: {
        position: 'absolute',
        top: '40%',
        left: '40%'
    }
});

class EditProject extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    };




    handleSubmit(event) {

        /*
        event.preventDefault();
        const data = new FormData(event.target);

        // This gets the data to populate the form.
        fetch('/api/form-submit-url', {
            method: 'POST',
            body: data,
        });*/
    };

    componentDidMount() {
        /* 
           my question: where have you queried the data from the model?
           this should be done here so that the rest of the project
           information is available in this component so that it can 
           be rendered
        */
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
                    <h1>Hello, your id is {id}</h1>

                    <Grid container justify="center">
                        <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
                            <Grid container item xs={12}>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <form>
                                            <Typography variant="body1" gutterBottom>
                                                <label htmlFor="title">Project title</label>
                                                <input id="title" name="title" type="text" value={this.props.value}/>
                                            </Typography>

                                            <Typography variant="body1" gutterBottom>
                                                <label htmlFor="description">Description</label>
                                                <input id="description" name="description" type="description"/>
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                                <label htmlFor="startDate">Start date</label>
                                                <input id="startDate" name="startDate" type="text"/>

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
        )
    }
};

export default withStyles(styles)(EditProject);

