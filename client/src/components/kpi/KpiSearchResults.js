import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { Link, Redirect } from "react-router-dom";
import { getProjectName, getProject, getOrgName, getOrgId } from "../../redux";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

let counter = 0;

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

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

const rows = [
  { id: "edit", numeric: false, disablePadding: false, label: "" },
  { id: "id", numeric: false, disablePadding: false, label: "ID" },
  { id: "title", numeric: false, disablePadding: false, label: "Title" },
  { id: "description", numeric: false, disablePadding: false, label: "Description" },
  { id: "type", numeric: false, disablePadding: false, label: "Type" },
  { id: "project", numeric: false, disablePadding: false, label: "Project Name" },
  { id: "organization", numeric: false, disablePadding: false, label: "Client" },
  { id: "tags", numeric: false, disablePadding: false, label: "Tags" }
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, numSelected, rowCount } = this.props;

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

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});


class KpiSearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.performSearch = this.performSearch.bind(this);
    this.editComponent = this.editComponent.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleAssign = this.handleAssign.bind(this);
  }

  state = {
    order: "asc",
    orderBy: "title",
    projectId: null,
    selected: [],
    data:[],        // this will be for the kpis
    submitted: null,
    readyToRedirect: false,
    page: 0,
    rowsPerPage: 5
  };

  performSearch() {
    // Search KPIs
    const projectId = getProject().id;
    const orgId = getOrgId();
    const searchOrgOnly = this.props.searchOrgOnly;
    let searchString = this.props.searchString;
    if (searchString != "") {
      fetch("/api/kpis-search" , {
        method: "GET",
        headers: new Headers({
          'searchString': searchString,
          'projectId': projectId,
          'orgId': orgId,
          'searchOrgOnly': searchOrgOnly
        })
      })
        .then(res => res.json())
        .then(kpis => this.setState({
          data: kpis,
          submitted: true,
          projectId: projectId
        }));
    }
  }

  componentWillReceiveProps(props) {
    this.performSearch();
  }

  componentDidMount() {
    // this.performSearch();
  }

  editComponent(id) {
    return `<Redirect to={{
      pathname: '/kpi',
      state: {
        projectId: ${this.props.projectId},
        kpiId: ${id}
      }
    }} />`;
  }

  handleAssign(event) {
    event.preventDefault();

    const projectId = getProject().id;
    const orgId = getOrgId();
    fetch("/api/kpis-assign/" + projectId, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    })
      .then(response => {
        // Redirect to the Project component.
        this.setState({
          readyToRedirect: true
        });
      })
      .catch(err => {

      });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  handleToggle = value => () => {
    // Use "selected" on the KPI search result array to manage the checkbox toggle,
    // stored in state as data[].
    const { selected } = this.state;
    const { data } = this.state;
    const idArray = data.map(k=> {return(k.id);});
    const currentIndex = idArray.indexOf(parseInt(value));
    data[currentIndex].selected = !data[currentIndex].selected;

    this.setState({
      data: data,
    });
  };

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const projectId = getProject().id;
    const projectName = getProjectName();
    const orgName = getOrgName();

    if (this.state.readyToRedirect) {
      return <Redirect to={`/project/${projectId}`} />;
    }

    return (
      <div>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell component="th" scope="row" padding="checkbox">
                        <Checkbox
                          key={n.id}
                          checked={!!+n.selected}
                          tabIndex={-1}
                          onChange={this.handleToggle(n.id)}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.id}
                      </TableCell>
                      <TableCell align="left">
                        <Link to={{
                          pathname: '/kpi',
                          state: {
                              projectId: this.props.projectId,
                              kpiId: n.id
                          } }}>
                          {n.title}
                        </Link>
                      </TableCell>
                      <TableCell align="left">{n.description}</TableCell>
                      <TableCell align="left">{n.type}</TableCell>
                      <TableCell align="left">{n.title}</TableCell>
                      <TableCell align="left">{n.orgName}</TableCell>
                      <TableCell align="left">{n.tags}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={this.handleAssign}
          className={classes.secondary}
        >
          Assign to Project
        </Button><br/><br/>
        <Typography
          component="h5"
          color="default"
          gutterBottom
        >
          Project: {projectName}<br/>
          Organization: {orgName}
        </Typography>
      </div>
    );
  }
}

KpiSearchResults.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(KpiSearchResults);
