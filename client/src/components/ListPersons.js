// List for editing persons, 1/22/19.
// Will be removed eventually.  Essentially a test harness for EditPerson.
import React, {Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Topbar from './Topbar';
import Grid from '@material-ui/core/Grid';
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, {TableCellProps as row} from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {BrowserRouter, Link} from 'react-router-dom'

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

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const rows = [
    {id: 'id', numeric: true, disablePadding: false, label: 'ID'},
    {id: 'username', numeric: false, disablePadding: true, label: 'Username'},
    {id: 'firstName', numeric: false, disablePadding: true, label: 'First name'},
    {id: 'lastName', numeric: false, disablePadding: true, label: 'Last name'},
    {id: 'email', numeric: false, disablePadding: false, label: 'Email address'},
    {id: 'organization', numeric: false, disablePadding: false, label: 'Organization'},
];

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class MyTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const {onSelectAllClick, order, orderBy, numSelected, rowCount} = this.props;

        return (
            <TableHead>
                <TableRow>
                    {rows.map(
                        row => (
                            <TableCell
                                key={row.id}
                                align={row.numeric ? 'right' : 'left'}
                                padding={row.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === row.id ? order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={this.createSortHandler(row.id)}
                                    >
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        ),
                        this,
                    )}
                </TableRow>
            </TableHead>
        );
    }
}

class ListPersons extends Component {
    constructor() {
        super();
    };

    state = {
        order: 'asc',
        orderBy: '',
        selected: [],
        persons: [],
    };

    componentDidMount() {
        fetch('/api/person')
            .then(res => res.json())
            .then(persons => this.setState({persons}));
    };


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

                                        <div className={classes.box}>
                                            <Typography color='secondary' gutterBottom>
                                                Full box
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                This is an example of a full-width box
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="body1" gutterBottom>
                                                <Paper className={classes.root}>
                                                    <div className={classes.tableWrapper}>
                                                        <Table className={classes.table}
                                                               aria-labelledby="tableTitle">
                                                            <MyTableHead/>
                                                            <TableBody>
                                                                {stableSort(this.state.persons, getSorting('asc', 'username'))
                                                                    .map(person => {
                                                                        return (
                                                                            <TableRow
                                                                                hover
                                                                                onClick={event => {
                                                                                }}
                                                                                tabIndex={-1}
                                                                                key={person.id}
                                                                            >
                                                                                <TableCell
                                                                                    align="right">{person.id}</TableCell>
                                                                                <TableCell
                                                                                    align="left"><Link to={`/editperson/${person.id}`}>{person.username}</Link></TableCell>
                                                                                <TableCell
                                                                                    align="left">{person.firstName}</TableCell>
                                                                                <TableCell
                                                                                    align="left">{person.lastName}</TableCell>
                                                                                <TableCell
                                                                                    align="left">{person.email}</TableCell>
                                                                                <TableCell
                                                                                    align="left">{person.Organization.name}</TableCell>
                                                                            </TableRow>
                                                                        );
                                                                    })}

                                                            </TableBody>
                                                        </Table>
                                                    </div>
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
        )
    }
}

export default withStyles(styles)(ListPersons);

