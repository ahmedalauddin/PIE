/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/naviagtion/CardToolbar.js
 * Created:  2019-3-27
 * Author:   Brad Kaufman
 * Descr:    Tabbed navigation for card components.
 * -----
 * Modified:
 * Editor:   Brad Kaufman
 * Notes:
 */
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "../Menu";
import { Link } from "react-router-dom";
import TableCell from "../ProjectKpis";

const styles = theme => ({
  appBar: {
    position: "relative",
    boxShadow: "none",
    borderBottom: `1px solid ${theme.palette.grey["100"]}`,
    backgroundColor: "white"
  },
  inline: {
    display: "inline"
  },
  flex: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center"
    }
  },
  link: {
    textDecoration: "none",
    color: "inherit"
  },
  productLogo: {
    display: "inline-block",
    borderLeft: `1px solid ${theme.palette.grey["A100"]}`,
    marginLeft: 32,
    paddingLeft: 24
  },
  tagline: {
    display: "inline-block",
    marginLeft: 10
  },
  iconContainer: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block"
    }
  },
  iconButton: {
    float: "right"
  },
  tabContainer: {
    marginLeft: 32,
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  tabItem: {
    paddingTop: 20,
    paddingBottom: 20,
    minWidth: "auto"
  }
});

class CardToolbar extends Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    value: 0,
    open: false
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, location } = this.props;

    return (
      <div className={classes.itemContainer}>
        <div className={classes.tabContainer}>
          <Tabs
            value={this.state.value}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="KPIs" component={Link} to={`../listkpis/${this.props.projid}`} />
            <Tab label="New KPI" component={Link} to="../kpicard"/>
            <Tab label="Action Items" component={Link} to={`../listactions/${this.props.projid}`} />
            <Tab label="New Action Item" component={Link} to="../actioncard"/>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CardToolbar);
