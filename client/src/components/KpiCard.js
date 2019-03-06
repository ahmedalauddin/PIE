/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/ProjectCard.js
 * Created:  2019-02-05 09:23:45
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-02-24
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
import classnames from 'classnames';
import {red} from '@material-ui/core/colors';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import moment from 'moment';
import Log from './Log';
import Button from '@material-ui/core/Button';
//import ButtonBar from './buttons/ButtonBar';
//import Button from '@material-ui/core/Button';
const mvcType = "controller";
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

class KpiCard extends React.Component {
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
    projid: 0,
    title: '',
    type: '',
    level: '',
    org: '',
    orgId: '',
    description: '',
    startAt: '',
    endAt: '',
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
        let updatePath = '/api/kpis/' + this.state.id;
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
        fetch('/api/kpis', {
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
      fetch(`/api/kpis/${this.props.match.params.id}`)
        .then(res => res.json())
        .then(kpi => {
          this.setState({
            id: this.props.match.params.id,
            title: kpi.title,
            description: kpi.description,
            level: kpi.level,
            type: kpi.type,
            projectid: kpi.projectId,
            startAt: moment(kpi.startAt).format('YYYY-MM-DD'),
            endAt: moment(kpi.endAt).format('YYYY-MM-DD')
          });
        });
    } else {
      this.setState({isEditing: true});
    }
    // Have to set the state of the individual fields for the handleChange function for the TextFields.
    // Do this using the project state.

    fetch('/api/organizations/?format=select')
      .then(results => results.json())
      .then(organizations => this.setState({organizations}));
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
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{verticalAlign: 'top'}}>
                            <Typography variant="h5" component="h2">
                              <TextField
                                required
                                id="title-required"
                                label="Title"
                                onChange={this.handleChange('title')}
                                value={this.state.title}
                                className={classes.textField}
                                margin="normal"
                              />
                            </Typography>
                          </TableCell>
                          <TableCell
                            style={{verticalAlign: 'top', width: '55%'}}
                          >
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
                                  shrink: true
                                }}
                              />
                            </Typography>
                            <Typography component="p">
                              <TextField
                                id="level"
                                label="Level"
                                multiline
                                rowsMax="4"
                                value={this.state.level}
                                onChange={this.handleChange('level')}
                                className={classes.textField}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                  shrink: true
                                }}
                              />
                            </Typography>
                            <Typography component="p">
                              <TextField
                                id="type"
                                label="Type"
                                multiline
                                rowsMax="4"
                                value={this.state.type}
                                onChange={this.handleChange('type')}
                                className={classes.textField}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{
                                  shrink: true
                                }}
                              />
                            </Typography>
                          </TableCell>
                          <TableCell
                            style={{verticalAlign: 'top', width: '25%'}}
                          >
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
                                    shrink: true
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
                                    shrink: true
                                  }}
                                />
                              </Typography>
                              <div className={classes.spaceTop}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={this.handleSubmit}
                                  className={classes.secondary}
                                >
                                  Update
                                </Button>
                              </div><br/>
                            </div>
                          </TableCell>
                        </TableRow>
                      </Table>
                    </CardContent>
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

export default withStyles(styles)(KpiCard);