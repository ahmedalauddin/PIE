import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import { getOrgName, getOrgId } from "../../redux";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton/index";
import {Redirect} from "react-router-dom";

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
  { id: "title", numeric: false, disablePadding: false, label: "Title" },
  { id: "description", numeric: false, disablePadding: false, label: "Description" },
  { id: "project", numeric: false, disablePadding: false, label: "Project" },
  { id: "type", numeric: false, disablePadding: false, label: "Type" }
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

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    paddingBottom: 200
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: "auto",
  }
});

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.performSearch = this.performSearch.bind(this);
    this.editComponent = this.editComponent.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  state = {
    order: "asc",
    orderBy: "title",
    projectId: null,
    selected: [],
    data:[],        // this will be for the kpis
    submitted: null,
    lastSearchString: "",
    readyToRedirect: false,
    redirectId: "",
    page: 0,
    rowsPerPage: 5
  };

  performSearch() {
    // Search against our fulltext index.
    const orgId = getOrgId();
    let searchString = this.props.searchString;
    if (searchString !== "" && searchString !== this.state.lastSearchString) {
      fetch("/api/ft-search", {
        method: "GET",
        headers: new Headers({
          term: searchString,
          orgid: orgId
        })
      })
        .then(res => res.json())
        .then(res => this.setState({
          data: res,
          submitted: true,
          lastSearchString: this.props.searchString
        }));
    }
  }

  componentWillReceiveProps(props) {
    this.performSearch();
  }

  componentDidMount() {
    this.performSearch();
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

  setEditRedirect = id => {
    this.setState({
      readyToEdit: true,
      redirectId: id
    });
  };

  renderEditRedirect = () => {
    if (this.state.readyToEdit) {
      return (
        <Redirect
          to={{
            pathname: "/project",
            state: {
              redirectId: this.state.kpiId
            }
          }}
        />
      );
    }
  };


  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const orgName = getOrgName();

    return (
      <React.Fragment>
        {this.renderEditRedirect()}
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
                .map(row => {
                  const isSelected = this.isSelected(row.id);
                  return (
                    <TableRow
                      hover
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isSelected}
                    >
                      <TableCell width="5%" component="th" scope="row" padding="none">
                        <IconButton
                          onClick={() => {
                            this.setEditRedirect(row.id);
                          }}
                        >
                          <EditIcon color="primary" />
                        </IconButton>
                      </TableCell>
                      <TableCell width="20%" align="left">{row.title}</TableCell>
                      <TableCell width="40%" align="left">{row.description}</TableCell>
                      <TableCell width="15%" align="left">{row.project}</TableCell>
                      <TableCell align="left">{row.source}</TableCell>
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
        <Typography
          component="h7"
          color="default"
          gutterBottom
        >
          Organization: {orgName}
        </Typography>
      </React.Fragment>
    );
  }
}

SearchResults.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchResults);
