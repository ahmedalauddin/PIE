// Main routes component for react Router.
import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import App from "./App";
import ProjectForm from "./ProjectForm";
import {Dashboard} from "@material-ui/icons";

// The routes component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const routes = () => (
    <routes>
        <Switch>
            <Route exact path='/App' component={App}/>
            <Route path='/Dashboard' component={Dashboard}/>
            <Route path='/ProjectForm' component={ProjectForm}/>
        </Switch>
    </routes>
)

export default routes