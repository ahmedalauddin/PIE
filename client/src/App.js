/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/App.js
 * Created:  2019-02-16 23:32:17
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-19 12:30:42
 * Editor:   Darrin Tisdale
 */
import React, { Component } from "react";
//import { UserContext } from "./components/UserContext";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "./stylesheets/App.css";
import Routes from "./routes";
import { blue, indigo } from "@material-ui/core/colors";
import { bindActionCreators } from "redux";
import { setUserAction, setOrgAction, getUser, getOrg } from "./redux";
import { connect } from "react-redux";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: blue[900]
    },
    primary: {
      main: indigo[700]
    }
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: ['"Lato"', "sans-serif"].join(",")
  }
});

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Routes/>
        </MuiThemeProvider>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  organization: state.organization,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default connect(mapStateToProps, mapDispatchToProps);



