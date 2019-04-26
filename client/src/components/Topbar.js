import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Menu from "./Menu";
const logo = require("../images/ValueInfLogo.png");
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
    if (this.props.currentPath === "/dashboard") {
      return 0;
    }
    if (this.props.currentPath === "/highlight") {
      return 1;
    }
    if (this.props.currentPath === "/login") {
      return 2;
    }
    if (this.props.currentPath === "/mindmap") {
      return 3;
    }
    if (this.props.currentPath === "/listprojects") {
      return 4;
    }
    if (this.props.currentPath === "/listorgs") {
      return 5;
    }
    if (this.props.currentPath === "/listpersons") {
      return 6;
    }
    if (this.props.currentPath === "/analytics") {
      return 7;
    }
    if (this.props.currentPath === "/clientorg") {
      return 8;
    }
    if (this.props.currentPath === "/signup") {
      return 9;
    }
    if (this.props.currentPath === "/logout") {
      return 10;
    }
    if (this.props.currentPath === "/about") {
      return 11;
    }
  };

  render() {
    const { classes, location } = this.props;
    const currentPath = location ? location.pathname : "/";

    return (
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <Grid container spacing={24} alignItems="baseline">
            <Grid item xs={12} className={classes.flex}>
              <div className={classes.inline}>
                <Typography variant="h6" color="inherit" noWrap>
                  <Link to="/" className={classes.link}>
                    <img width={125} src={logo} alt="ValueInfinity"/>
                  </Link>
                </Typography>
              </div>
              <React.Fragment>
                <div className={classes.productLogo}>
                  <Typography>Innovation Platform</Typography>
                </div>
                <div className={classes.tabContainer}>
                  <Tabs
                    value={this.current() || this.state.value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                  >
                    {Menu.map((item, index) => (
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
