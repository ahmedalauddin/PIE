// Main routes component for react Router.
import React from 'react'
import {Route, Switch, BrowserRouter} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Cards from './components/Cards'
import Main from './components/Main'
import ScrollToTop from './components/ScrollTop'
import NewProject from "./components/NewProject";
import EditProject from "./components/EditProject";
import ListProjects from "./components/ListProjects";
import Login from "./components/Login";
import ListPersons from "./components/ListPersons";
import EditPerson from "./components/EditPerson";


export default props => (
    <BrowserRouter>
        <ScrollToTop>
            <Switch>
                <Route exact path='/' component={ Main } />
                <Route exact path='/dashboard' component={ Dashboard } />
                <Route exact path='/login' component={ Login } />
                <Route exact path='/editproject' component={ EditProject } />
                <Route path='/editproject/:id' component={ EditProject } />
                <Route exact path='/editperson' component={ EditPerson } />
                <Route path='/editperson/:id' component={ EditPerson } />
                <Route exact path='/newproject' component={ NewProject } />
                <Route exact path='/listprojects' component={ ListProjects } />
                <Route exact path='/listpersons' component={ ListPersons } />
                <Route exact path='/cards' component={ Cards } />
            </Switch>
        </ScrollToTop>
    </BrowserRouter>
)