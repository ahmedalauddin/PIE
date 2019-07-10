/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/ListIdeas.js
 * Created:  2019-07-08
 * Descr:    Lists cards for ideas.
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { getOrgId } from "../../redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const styles = theme => ({
  grid: {
    width: 1200,
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    color: theme.palette.text.secondary
  },
  rangeLabel: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.unit * 2
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32
  },
  outlinedButton: {
    textTransform: "uppercase",
    margin: theme.spacing.unit
  },
  actionButton: {
    textTransform: "uppercase",
    margin: theme.spacing.unit,
    width: 152
  },
  blockCenter: {
    padding: theme.spacing.unit * 2,
    textAlign: "center"
  },
  block: {
    padding: theme.spacing.unit * 2
  },
  box: {
    marginBottom: 40,
    height: 65
  },
  inlining: {
    display: "inline-block",
    marginRight: 10
  },
  buttonBar: {
    display: "flex"
  },
  alignRight: {
    display: "flex",
    justifyContent: "flex-end"
  },
  noBorder: {
    borderBottomStyle: "hidden"
  },
  loadingState: {
    opacity: 0.05
  },
  loadingMessage: {
    position: "absolute",
    top: "40%",
    left: "40%"
  },
  card: {
    maxWidth: 1000
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textFieldWide: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  spaceTop: {
    marginTop: 50
  }
});

class ListIdeas extends React.Component {
  constructor(props) {
    super(props);
    this.fetchIdeas = this.fetchIdeas.bind(this);
  };

  state = {
    ideas: [],
  };

  fetchIdeas = () => {
    let orgId = getOrgId();

    if (orgId !== "") {
      fetch(`/api/ideas-org/${orgId}`)
        .then(res => res.json())
        .then(ideas => this.setState({ ideas }));
    }
  };

  componentDidMount() {
    this.fetchIdeas();
  };

  componentDidUpdate(prevProps) {
  };

  render() {
    const { classes } = this.props;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (

      <div className={classes.paper}>
        <Grid container spacing={12}>
          {this.state.ideas.map(idea => {
            return (
              <div>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography
                      style={{ textTransform: "uppercase" }}
                      color="secondary"
                      gutterBottom
                    >
                      Idea
                    </Typography>
                    <Typography variant="h7" gutterBottom>
                      {idea.ideaText}
                    </Typography>
                  </CardContent>
                </Card>
                <br/><br/>
              </div>
            );
          })}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ListIdeas);
