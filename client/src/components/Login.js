// Login form using Formik.
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
    outlinedButton: {
        textTransform: 'uppercase',
        margin: theme.spacing.unit
    },
    actionButton: {
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


function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
};

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
};

class Login extends Component {
    state = {
        order: 'asc',
        orderBy: 'name',
        orgs: [],
        learnMoredialog: false,
        getStartedDialog: false
    };

    componentDidMount() {
        fetch('/api/organization')
            .then(res => res.json())
            .then(orgs => this.setState({orgs}));
    };

    openDialog = (event) => {
        this.setState({learnMoredialog: true});
    };

    dialogClose = (event) => {
        this.setState({learnMoredialog: false});
    };

    openGetStartedDialog = (event) => {
        this.setState({getStartedDialog: true});
    };

    closeGetStartedDialog = (event) => {
        this.setState({getStartedDialog: false});
    };



    render() {
        const {classes} = this.props;

        //const organizations = this.state.orgs;


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
                                                    Please login.
                                                </Typography>
                                                <Typography variant="body2" gutterBottom>
                                                    <Formik
                                                        initialValues={{
                                                            email: '',
                                                            organization: ''
                                                        }}

                                                        // Validates our data
                                                        /*
                                                        validate={values => {
                                                            //const errors = {};

                                                            if (!values.email) errors.email = "Required";

                                                            if (
                                                                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
                                                            ) {
                                                                errors.email = "You must provide a valid email address.";
                                                            }

                                                            return errors;
                                                        }}
                                                        */

                                                        onSubmit={values => {
                                                            setTimeout(() => {
                                                                alert(JSON.stringify(values, null, 2));
                                                            }, 500);
                                                        }}
                                                        render={() => (
                                                            <Form>
                                                                <div>
                                                                    <label htmlFor="email">Email</label>
                                                                    <Field name="email" placeholder="Jane"/>
                                                                </div>
                                                                <div>
                                                                    <label
                                                                        htmlFor="organization">Organization</label>
                                                                    <Field
                                                                        name="organization"
                                                                        component="select"
                                                                        placeholder="Organization"
                                                                    >
                                                                        {this.state.orgs.map(org =>
                                                                            <option value={org.name}>{org.name}</option>)
                                                                        }
                                                                    </Field>
                                                                </div>
                                                                <div>
                                                                    <button type="submit">Submit</button>
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
};

export default withRouter(withStyles(styles)(Login));