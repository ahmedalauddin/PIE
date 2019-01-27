// List for editing persons, 1/22/19.
// Will be removed eventually.  Essentially a test harness for EditPerson.
import React, {Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Topbar from './Topbar';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell, {TableCellProps as row} from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {BrowserRouter, Link} from 'react-router-dom';

import {styles, backgroundShape} from './MaterialSense';

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
    {id: 'title', numeric: false, disablePadding: true, label: 'Title'},
    {id: 'description', numeric: false, disablePadding: true, label: 'Description'},
    {id: 'status', numeric: false, disablePadding: true, label: 'Status'},
    {id: 'type', numeric: false, disablePadding: false, label: 'Type'},
    {id: 'level', numeric: false, disablePadding: false, label: 'Level'},
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

class ListKpis extends Component {
    constructor() {
        super();
    }

    state = {
        order: 'asc',
        orderBy: '',
        selected: [],
        kpis: [],
    };

    componentDidMount() {
        // Use fetch to get all the KPIs
        fetch('/api/kpi')
            .then(res => res.json())
            .then(kpis => this.setState({kpis}));
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
                                            <Typography variant="body1" gutterBottom>
                                                <Paper className={classes.root}>
                                                    <div className={classes.tableWrapper}>
                                                        <Table className={classes.table}
                                                            aria-labelledby="tableTitle">
                                                            <MyTableHead/>
                                                            <TableBody>
                                                                {stableSort(this.state.kpis, getSorting('asc', 'title'))
                                                                    .map(kpi => {
                                                                        return (
                                                                            <TableRow
                                                                                hover
                                                                                onClick={event => {
                                                                                }}
                                                                                tabIndex={-1}
                                                                                key={kpi.id}
                                                                            >
                                                                                <TableCell
                                                                                    align="right">{kpi.id}</TableCell>
                                                                                <TableCell
                                                                                    align="left"><Link to={`/editkpi/${kpi.id}`}>{kpi.title}</Link></TableCell>
                                                                                <TableCell
                                                                                    align="left">{kpi.description}</TableCell>
                                                                                <TableCell
                                                                                    align="left">{kpi.status}</TableCell>
                                                                                <TableCell
                                                                                    align="left">{kpi.type}</TableCell>
                                                                                <TableCell
                                                                                    align="right">{kpi.level}</TableCell>
                                                                                <TableCell
                                                                                    align="left">{kpi.Organization.name}</TableCell>
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
        );
    }
}

export default withStyles(styles)(ListKpis);

