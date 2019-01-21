// Main routes component for react Router.
import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Cards from './components/Cards'
import Main from './components/Main'
import ScrollToTop from './components/ScrollTop'
import NewProject from "./components/NewProject";

export default props => (
    <HashRouter>
        <ScrollToTop>
            <Switch>
                <Route exact path='/' component={ Main } />
                <Route exact path='/dashboard' component={ Dashboard } />
                <Route exact path='/newproject' component={ NewProject } />
                <Route exact path='/cards' component={ Cards } />
            </Switch>
        </ScrollToTop>
    </HashRouter>
)