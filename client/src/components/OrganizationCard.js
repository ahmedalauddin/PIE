/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/OrganizationCard.js
 * Created:  2019-03-01
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-03-01
 * Editor:   Brad Kaufman
 * Notes:    Uses Material UI controls, including simple select, see https://material-ui.com/demos/selects/.
 */
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Topbar from './Topbar';
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
import {Redirect, Link} from 'react-router-dom';
//import ButtonBar from './buttons/ButtonBar';
//import Button from '@material-ui/core/Button';

const materialstyles = theme => ({
  card: {
    maxWidth: 400
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  actions: {
    display: 'flex'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
});

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

const ExpandingSectionGridItem = (classes, project) => {
  // TODO - add the org's project list here.
  // Just a placeholder for stuff we'll put in the expanding section.  Considering putting action items here.
  return (
    <div className={classes.inlineLeft}>
      <Typography
        variant="h6"
        style={{textTransform: 'uppercase'}}
        color="secondary"
        gutterBottom
      >
        This organization s projects
      </Typography>
      <Typography variant="h5" gutterBottom>
        Project #1
      </Typography>
      <Typography variant="h7" gutterBottom>
        Leading KPI
        <br/>
        Project started 12 February 2018
        <br/>
      </Typography>
      <Typography variant="h5" gutterBottom>
        Project #2
      </Typography>
      <Typography variant="h7" gutterBottom>
        Leading KPI
        <br/>
        Project started 14 March 2018
        <br/>
      </Typography>

    </div>
  );
};

class OrganizationCard extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  // Note that I'll need the individual fields for handleChange.  Use state to manage the inputs for the various
  // fields.
  state = {
    project: {},
    organizations: [],
    orgname: '',
    orgId: 0,
    isEditing: false,
    redirect: false,
    isNew: false,
    expanded: false,
    labelWidth: 0
  };

  handleChange = name => event => {
    this.setState({[name]: event.target.value});
  };

  handleSelectChange = event => {
    this.setState({orgId: event.target.value});
  };

  handleExpandClick = () => {
    this.setState(state => ({expanded: !state.expanded}));
  };

  //handleSubmit(values, {resetForm, setErrors, setSubmitting}) {
  handleSubmit(event) {
    event.preventDefault();

    setTimeout(() => {
      if (this.state.id > 0) {
        // alert('We have an ID, proj id = ' + this.state.id + ', title = ' + this.state.title);
        // We have a project id passed through the URL, do an
        // update on the project.
        let updatePath = '/api/organizations/' + this.state.id;
        fetch(updatePath, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(this.state)
        })
          .then(data => {
            //console.log(data);
          })
          .catch(err => {
            //console.log(err);
          });
      } else {
        // No project id, so we will do a create.  The difference
        // is we do a POST instead of a PUT.
        fetch('/api/organizations', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(this.state)
        })
          .then(data => {
            //console.log(data);
          })
          .catch(err => {
            //console.log(err);
          });
      }
      //setSubmitting(false);
    }, 2000);
  }

  componentDidMount() {
    if (parseInt(this.props.match.params.id) > 0) {
      fetch(`/api/organizations/${this.props.match.params.id}`)
        .then(res => res.json())
        .then(organization => {
          this.setState({
            id: this.props.match.params.id,
            name: organization.name,
            orgId: organization.orgId
          });
        });
    } else {
      this.setState({isEditing: true});
    }
    // Have to set the state of the individual fields for the handleChange function for the TextFields.
    // Do this using the project state.
    // TODO - fetch projects for this org
    fetch('/api/projects/')
      .then(results => results.json())
      .then(projects => this.setState({projects}));
  }

  render() {
    const {classes} = this.props;
    //const currentPath = this.props.location.pathname;

    /* react-router has injected the value of the attribute ID into the params */
    const id = this.props.match.params.id;


    return (
      <React.Fragment>
        <CssBaseline/>
        <Topbar/>
        <form onSubmit={this.handleSubmit} noValidate>
          <div className={classes.root}>
            <Grid container justify="center">
              <Grid
                spacing={24}
                alignItems="center"
                justify="center"
                container
                className={classes.grid}
              >
                <Grid item xs={12}>
                  <SectionHeader title="" subtitle=""/>
                  <Card className={classes.card}>
                    <CardContent>
                      <Table>
                        <TableRow>
                          <TableCell style={{verticalAlign: 'top'}}>
                            <Typography
                              style={{textTransform: 'uppercase'}}
                              color="secondary"
                              gutterBottom
                            >
                            </Typography>
                            <Typography variant="h5" component="h2">
                              <TextField
                                required
                                id="title-required"
                                label="Name"
                                onChange={this.handleChange('name')}
                                value={this.state.name}
                                className={classes.textField}
                                margin="normal"
                              />
                            </Typography>
                            <Typography variant="h5" component="h2">
                              <div className={classes.spaceTop}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={this.handleSubmit}
                                  className={classes.secondary}
                                >
                                  Submit
                                </Button>
                              </div><br/>
                              <div className={classes.spaceTop}>
                                <Button component={Link} to={`/listprojects/${this.props.match.params.id}`}>
                                  List Projects
                                </Button>
                              </div>
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </Table>
                    </CardContent>
                    <CardActions
                      className={classes.actions}
                      disableActionSpacing
                    >
                      <IconButton
                        className={classnames(classes.expand, {
                          [classes.expandOpen]: this.state.expanded
                        })}
                        onClick={this.handleExpandClick}
                        aria-expanded={this.state.expanded}
                        aria-label="Show more"
                      >
                        <ExpandMoreIcon/>
                      </IconButton>
                    </CardActions>
                    <Collapse
                      in={this.state.expanded}
                      timeout="auto"
                      unmountOnExit
                    >
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

export default withStyles(styles)(OrganizationCard);
