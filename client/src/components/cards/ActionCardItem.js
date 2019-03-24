import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import DescriptionIcon from "@material-ui/icons/Description";

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  avatar: {
    margin: 10,
    backgroundColor: theme.palette.grey["200"],
    color: theme.palette.text.primary
  },
  avatarContainer: {
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
      marginBottom: theme.spacing.unit * 4
    }
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  },
  baseline: {
    alignSelf: "baseline",
    marginLeft: theme.spacing.unit * 4,
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      alignItems: "center",
      width: "100%",
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
      marginLeft: 0
    }
  },
  inline: {
    display: "inline-block",
    marginLeft: theme.spacing.unit * 4,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0
    }
  },
  inlineRight: {
    width: "30%",
    textAlign: "right",
    marginLeft: 50,
    alignSelf: "flex-end",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: 0,
      textAlign: "center"
    }
  },
  backButton: {
    marginRight: theme.spacing.unit * 2
  }
});

class ActionCardItem extends Component {
  render() {
    //Card item is just enclosed with a <div>
    const { classes } = this.props;

    return (
      <Paper className={classes.paper} style={{position: 'relative'}}>
        <div className={classes.itemContainer}>

          <div className={classes.baseline}>
            <div className={classes.inline}>
              <Typography
                style={{ textTransform: "uppercase" }}
                color="secondary"
                gutterBottom
              >
                Action Item
              </Typography>
              <Typography variant="h6" gutterBottom>
                Action title goes here
              </Typography>
              <Typography variant="h7" gutterBottom>
                Action description goes here
              </Typography>
              <Typography variant="h7" gutterBottom>
                Action status goes here
              </Typography>
            </div>
            <div className={classes.avatarContainer}>
              <Avatar className={classes.avatar}>
                <DescriptionIcon />
              </Avatar>
            </div>
          </div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(ActionCardItem);
