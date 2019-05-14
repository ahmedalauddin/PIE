import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import { Link } from "react-router-dom";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import moment from "moment";
import AlarmOnIcon from "@material-ui/icons/AlarmOn";
import AddIcon from "@material-ui/core/SvgIcon/SvgIcon";

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
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
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  inline: {
    display: 'inline',
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

class MilestoneList extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    milestones: [],
  };

  componentDidMount() {
    // MilestoneList is expected to take a param of project ID, and fetch the KPIs
    // associated only with that project.
    let projectid = parseInt(this.props.projectId);

    if (projectid) {
      // Fetch the KPIs only for a single project
      fetch(`/api/milestones-project/${projectid}`)
        .then(res => res.json())
        .then(milestones => this.setState({ milestones: milestones }));
    }
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

  render() {
    const { classes } = this.props;
    const { milestones } = this.state;
    //let counter = 1;

    return (
      <List component="nav" className={classes.root}>
        {milestones.map((milestone,i) => (
          <div key={milestone}>
            <ListItem alignItems="flex-start">
              <AlarmOnIcon coor="primary" className={classes.leftIcon}/>
              <ListItemText
                primary={`Milestone ${i+1}: ${milestone.title}`}
                secondary={
                  <React.Fragment>
                    <Typography component="span" className={classes.inline} color="textPrimary">
                      Target date:
                    </Typography>
                    {" " + moment(milestone.targetDate).format("YYYY-MM-DD")}
                  </React.Fragment>
                }
              />
            </ListItem>
              {milestone.tasks.map(task => (
                <ListItem className={classes.nested}>
                <Typography variant="h7">
                  <ListItemText inset primary={`${task.title}: ${task.description}`}/>
                </Typography>
              </ListItem>
              )
            )}
          </div>
        ),
        this)
        }
      </List>
    );
  }
}

MilestoneList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MilestoneList);
