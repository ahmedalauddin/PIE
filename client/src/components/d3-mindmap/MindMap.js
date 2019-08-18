/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/MindMap.js
 * Descr:    Container page for D3 mind map.
 * Created:  2019-06-22
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-08-14
 * Changes:  Tabs for node detail and prioritzing KPIs.
 * Editor:   Brad Kaufman
 */
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "../Topbar";
import withStyles from "@material-ui/core/styles/withStyles";
import * as d3 from "d3";
import { red, grey } from "@material-ui/core/colors";
import "./tree-styles.scss";
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import { getOrgId, getOrgName } from "../../redux";
import Snackbar from "@material-ui/core/Snackbar";
import TreeMindMap from "./TreeMindMap";
import NodeDetail from "./NodeDetail";
import PrioritizeKpis from "./PrioritizeKpis";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";

const DEBUG = false;

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const styles = theme => ({
  grid: {
    width: 1200,
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  root: {
    height: "100vh"
  },
  paper: {
    padding: theme.spacing.unit * 3,
    display: "flex",
    textAlign: "left",
    flexDirection: "column",
    color: theme.palette.text.secondary
  },
  rangeLabel: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.unit * 2
  },
  /*
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
   */
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
  avatar: {
    backgroundColor: red[500]
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

class MindMap extends React.Component {
  constructor(props) {
    super(props);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.state = {
      orgName: getOrgName(),
      orgId: getOrgId(),
      selectedNodeId: "",
      openSnackbar: false,
      message: "",
      tabValue: 0
    };
  }

  sendSelectedNode(nodeId) {
    this.setState({
      selectedNodeId: nodeId
    });
  }

  componentDidMount() {
    let message = "";
    if (this.props.location.state && this.props.location.state.message)  {
      message = this.props.location.state.message;
      this.setState({
        openSnackbar: true,
        message: message
      });
    }
  }

  showMessages = (message) => {
    // alert(message);
    this.setState( {
      openSnackbar: true,
      message: message
    });
  };

  // Functions for the snackbar
  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };

  showNodeDetail = () => {
    let showDetail = false;
    if (showDetail) {
      return (
        <Grid item xs={12} sm={2} md={2} component={Paper}>
          <NodeDetail nodeId={this.state.selectedNodeId} messages={this.showMessages}/>
        </Grid>);
    }
  };

  handleTabChange = (event, newValue) => {
    this.setState({
      tabValue: newValue
    });
  }

  render() {
    const { classes } = this.props;

    if (DEBUG) {
      return (
        <React.Fragment>
          <CssBaseline />
          <Topbar />
          <div className={classes.root}>
            <Grid container className={classes.root} spacing={24}>
              <Grid item xs={false} sm={12} md={12} >
                <TreeMindMap callback={this.sendSelectedNode.bind(this)} />
              </Grid>
              <Snackbar
                open={this.state.openSnackbar}
                onClose={this.handleClose}
                TransitionComponent={this.state.Transition}
                ContentProps={{
                  "aria-describedby": "message-id"
                }}
                message={<span id="message-id">{this.state.message}</span>}
              />
            </Grid>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <CssBaseline />
          <Topbar />
          <div className={classes.root}>
            <Grid container className={classes.root} spacing={24}>
              <Grid item xs={false} sm={9} md={9} >
                <TreeMindMap callback={this.sendSelectedNode.bind(this)} />
              </Grid>
              <Grid item xs={false} sm={3} md={3} >
                <div className={classes.root}>
                  <AppBar position="static">
                    <Tabs value={this.state.tabValue} onChange={this.handleTabChange}>
                      <Tab label="Node" />
                      <Tab label="Prioritized KPIs" />
                    </Tabs>
                  </AppBar>
                  {this.state.tabValue === 0 && (
                    <TabContainer>
                      <NodeDetail nodeId={this.state.selectedNodeId} messages={this.showMessages}/>
                    </TabContainer>)}
                  {this.state.tabValue === 1 && (
                    <TabContainer>
                      <PrioritizeKpis />
                    </TabContainer>)}
                </div>
              </Grid>
              <Snackbar
                open={this.state.openSnackbar}
                onClose={this.handleClose}
                TransitionComponent={this.state.Transition}
                ContentProps={{
                  "aria-describedby": "message-id"
                }}
                message={<span id="message-id">{this.state.message}</span>}
              />
            </Grid>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default withStyles(styles)(MindMap);
