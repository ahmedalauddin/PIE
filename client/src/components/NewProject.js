// New project form using Formik.
//
import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import InstructionDialog from './dialogs/InstructionDialog';
import SwipeDialog from './dialogs/SwipeDialog';
import Topbar from './Topbar';
import {Formik, Field, Form} from 'formik';
import {Debug} from './Debug';

const backgroundShape = require('../images/shape.svg');

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.grey['100'],
        overflow: 'hidden',
        background: `url(${backgroundShape}) no-repeat`,
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

class Dashboard extends Component {

    state = {
        learnMoredialog: false,
        getStartedDialog: false
    };

    componentDidMount() {
    }

    openDialog = (event) => {
        this.setState({learnMoredialog: true});
    }

    dialogClose = (event) => {
        this.setState({learnMoredialog: false});
    }

    openGetStartedDialog = (event) => {
        this.setState({getStartedDialog: true});
    }

    closeGetStartedDialog = (event) => {
        this.setState({getStartedDialog: false});
    }

    render() {
        const {classes} = this.props;
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
                                        <div>
                                            <div className={classes.box}>
                                                <Typography color='secondary' gutterBottom>
                                                    New Project
                                                </Typography>
                                                <Typography variant="body1" gutterBottom>
                                                    Form for entering project info.
                                                </Typography>
                                            </div>
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid container item xs={12}>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <div>
                                            <div className={classes.box}>
                                                <Typography color='secondary' gutterBottom>
                                                    Full box
                                                </Typography>
                                                <Typography variant="body1" gutterBottom>
                                                    <Formik
                                                        initialValues={{
                                                            firstName: '',
                                                            lastName: '',
                                                            email: '',
                                                        }}
                                                        onSubmit={values => {
                                                            setTimeout(() => {
                                                                alert(JSON.stringify(values, null, 2));
                                                            }, 500);
                                                        }}
                                                        render={() => (
                                                            <Form>
                                                                <div>
                                                                    <label htmlFor="firstName">First Name</label>
                                                                    <Field name="firstName" placeholder="Jane"/>
                                                                </div>
                                                                <div>
                                                                    <label htmlFor="lastName">Last Name</label>
                                                                    <Field name="lastName" placeholder="Doe"/>
                                                                </div>
                                                                <div>
                                                                    <label htmlFor="email">Email</label>
                                                                    <Field name="email" placeholder="jane@acme.com"
                                                                        type="email"/>
                                                                    <button type="submit">Submit</button>
                                                                </div>
                                                                <div>
                                                                    <Debug/>
                                                                </div>
                                                            </Form>
                                                        )}
                                                    />
                                                </Typography>
                                            </div>
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <SwipeDialog
                        open={this.state.learnMoredialog}
                        onClose={this.dialogClose}/>
                    <InstructionDialog
                        open={this.state.getStartedDialog}
                        onClose={this.closeGetStartedDialog}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(Dashboard));