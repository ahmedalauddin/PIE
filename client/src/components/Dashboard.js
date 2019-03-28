import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import InstructionDialog from "./dialogs/InstructionDialog";
import SwipeDialog from "./dialogs/SwipeDialog";
import Topbar from "./Topbar";
import SectionHeader from './typo/SectionHeader';
import ProjectCardItem from "./cards/ProjectCardItem";
import ActionCardItem from "./cards/ActionCardItem";
import { getSorting } from "./TableFunctions";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey['100'],
    overflow: 'hidden',
    paddingBottom: 200
  },
  grid: {
    width: 1200,
    margin: `0 ${theme.spacing.unit * 2}px`,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 20px)'
    }
  },
  loadingState: {
    opacity: 0.05
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  rangeLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.unit * 2
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing.unit
  },
  actionButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing.unit,
    width: 152,
    height: 36
  },
  blockCenter: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center'
  },
  block: {
    padding: theme.spacing.unit * 2,
  },
  loanAvatar: {
    display: 'inline-block',
    verticalAlign: 'center',
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main
  },
  interestAvatar: {
    display: 'inline-block',
    verticalAlign: 'center',
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light
  },
  inlining: {
    display: 'inline-block',
    marginRight: 10
  },
  buttonBar: {
    display: 'flex'
  },
  noBorder: {
    borderBottomStyle: 'hidden'
  },
  mainBadge: {
    textAlign: 'center',
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4
  }
});

class Dashboard extends Component {
  state = {
    learnMoreDialog: false,
    getStartedDialog: false,
    projects: [],
    actions: []
  };

  componentDidMount() {
    fetch("/api/project-dashboard")
      .then(res => res.json())
      .then(projects => this.setState({ projects }));
    fetch("/api/tasks/mostrecent")
      .then(res => res.json())
      .then(actions => this.setState({ actions }));
  }

  openDialog = event => {
    this.setState({ learnMoreDialog: true });
  };

  dialogClose = event => {
    this.setState({ learnMoreDialog: false });
  };

  openGetStartedDialog = event => {
    this.setState({ getStartedDialog: true });
  };

  closeGetStartedDialog = event => {
    this.setState({ getStartedDialog: false });
  };

  render() {
    const { classes } = this.props;
    const currentPath = this.props.location.pathname;
    let i = 1;
    let j = 1;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar currentPath={currentPath}/>
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid spacing={24} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
                <div className={classes.topBar}>
                  <div className={classes.block}>
                    <Typography variant="h6" gutterBottom>Projects</Typography>
                    <Typography variant="body2">
                      Active projects listed by last update.
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid container spacing={24} xs={12} justify="center">
                {this.state.projects.map(Project => {
                  if (i <= 3) {
                    i++;
                    return (
                      <Grid item xs={12} md={4}>
                        <ProjectCardItem title={Project.title} description={Project.description}
                          started={Project.startAt}/>
                      </Grid>
                    );
                  } else {
                    return "";
                  }
                })
                }
              </Grid>
              <Grid item xs={12}>
                <div className={classes.topBar}>
                  <div className={classes.block}>
                    <Typography variant="h6" gutterBottom>Actions</Typography>
                    <Typography variant="body2">
                      Active action items listed by last update.
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid container spacing={24} xs={12} justify="center">
                {this.state.actions.map(Action => {
                  if (j <= 6) {
                    j++;
                    return (
                      <Grid item xs={12} md={4}>
                        <ActionCardItem title={Action.title} description={Action.description}
                          status={Action.status} updated={Action.updatedAt}/>
                      </Grid>
                    );
                  } else {
                    return "";
                  }
                })}
              </Grid>
            </Grid>
          </Grid>
          <SwipeDialog
            open={this.state.learnMoreDialog}
            onClose={this.dialogClose}
          />
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
