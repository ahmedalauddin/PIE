/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/App.js
 * Created:  2019-02-16 23:32:17
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-02-17 00:01:47
 * Editor:   Darrin Tisdale
 */

import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "./app.css";
import Routes from "./routes";
import { blue, indigo } from "@material-ui/core/colors";
import withAuth from "./components/withAuth";

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

class App extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Routes />
        </MuiThemeProvider>
      </div>
    );
  }
}

//export default withAuth(App);
export default App;
