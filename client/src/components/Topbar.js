import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";
import { isAdministrator, isLoggedIn } from "../redux";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const logo = require("../images/ValueInfLogo.png");
const styles = theme => ({
  appBar: {
    position: "relative",
    boxShadow: "none",
    borderBottom: `1px solid ${theme.palette.grey["100"]}`,
    backgroundColor: "white"
  },
  image: {
    backgroundSize: "cover",
    backgroundPosition: "center"
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

const AdminMenu = [
  {
    label: "Dashboard",
    pathname: "/paneldashboard"
  },
  {
    label: "Login",
    pathname: "/login"
  },
  {
    label: "Mind Map",
    pathname: "/mindmap"
  },
  {
    label: "Search",
    pathname: "/search"
  },
  {
    label: "Projects",
    pathname: "/projectdashboard"
  },
  {
    label: "Organizations",
    pathname: "/orgdashboard"
  },
  {
    label: "Analytics",
    pathname: "/analytics"
  },
  {
    label: "Client Filter",
    pathname: "/clientorg"
  },
  {
    label: "Logout",
    pathname: "/logout"
  },
  {
    label: "About",
    pathname: "/about"
  }
];

class Topbar extends Component {
  state = {
    value: 0,
    open: false
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  current = () => {
    let value = 0;
    if (this.props.currentPath === "/login") {
      value = 0;
    }
    if (this.props.currentPath === "/paneldashboard") {
      value = 1;
    }
    if (this.props.currentPath === "/mindmaplist") {
      value = 2;
    }
    if (this.props.currentPath === "/search") {
      value = 3;
    }
    if (this.props.currentPath === "/projectdashboard") {
      value = 4;
    }
    if (this.props.currentPath === "/listorgs") {
      value = 5;
    }
    if (this.props.currentPath === "/analytics") {
      value = 6;
    }
    if (this.props.currentPath === "/clientorg") {
      value = 7;
    }
    if (this.props.currentPath === "/logout") {
      value = 8;
    }
    if (this.props.currentPath === "/about") {
      value = 9;
    }
    return value;
  };

  render() {
    const { classes, location } = this.props;
    const currentPath = location ? location.pathname : "/";
    let loggedIn = isLoggedIn();
    let isAdmin =  isAdministrator();

    return (
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <Grid container spacing={24} alignItems="baseline">
            <Grid item xs={12} className={classes.flex}>

              <React.Fragment>
                <div className={classes.tabContainer}>
                  <Tabs
                    value={this.current() || this.state.value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                  >
                    {AdminMenu.map((item, index) => (
                      <Tab key={index} component={Link} to={{pathname: item.pathname, search: this.props.location.search}} classes={{root: classes.tabItem}} label={item.label} />
                    ))}
                  </Tabs>
                </div>
              </React.Fragment>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(withStyles(styles)(Topbar));
