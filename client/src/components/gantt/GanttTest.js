/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/GanttTest.js
 * Created:  2019-10-01
 * Desc:     LUsing Dhtmlx Gantt.
 * Author:   Brad Kaufman
 *
 * Modified: 2019-10-02
 * Editor:   Brad Kaufman
 */
import React, { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline/index";
import Topbar from "../Topbar";
import withStyles from "@material-ui/core/styles/withStyles";
import { getOrgId, getOrgName } from "../../redux";
import Gantt from "./Gantt";
import { Redirect } from "react-router-dom";

function handleNull(refToParse) {
  try {
    if (refToParse != null) {
      return refToParse;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    paddingBottom: 200
  },
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
    color: theme.palette.text.secondary
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "15%",
    flexShrink: 0
  },
  card: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    maxWidth: 1200,
    color: theme.palette.text.secondary
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  details: {
    alignItems: "center"
  },
  column: {
    flexBasis: "15%"
  },
  wideColumn: {
    flexBasis: "35%"
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    }
  }
});
const data = {
  data: [
    { id: 1, text: "Task #1", start_date: "2019-04-15 1:00", duration: 3, progress: 0.6 },
    { id: 2, text: "Task #2", start_date: "2019-04-18 9:00", duration: 3, progress: 0.4 }
  ],
  links: [
    { id: 1, source: 1, target: 2, type: "0" }
  ]
};
class GanttTest extends Component {
  constructor(props) {
    super(props);

  };

  state = {
    order: "asc",
    orderBy: "",
    orgId: getOrgId(),
    orgName: getOrgName(),
    selected: [],
    readyToEdit: false,
  };

  componentDidCatch(error, info) {
    console.log("error: " + error + ", info: " + info);
    this.setState({hasError: true});
    return <Redirect to="/Login" />;
  };

  componentDidMount() {

  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div>
          <div className="gantt-container">
            <Gantt tasks={data}/>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(GanttTest);
