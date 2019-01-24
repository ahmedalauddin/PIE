// Main routes component for react Router.
import React from 'react'
import {Route, Switch, BrowserRouter} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Cards from './components/Cards'
import Main from './components/Main'
import Login from "./components/Login";
import ScrollToTop from './components/ScrollTop'
import NewProject from "./components/NewProject";
import EditPerson from "./components/EditPerson";
import EditProject from "./components/EditProject";
import EditKpi from "./components/EditKpi";
import ListProjects from "./components/ListProjects";
import ListPersons from "./components/ListPersons";
import ListKpis from "./components/ListKpis";
import MindMapStatic from "./components/MindMapStatic";


export default props => (
    <BrowserRouter>
        <ScrollToTop>
            <Switch>
                <Route exact path='/' component={ Main } />
                <Route exact path='/dashboard' component={ Dashboard } />
                <Route exact path='/login' component={ Login } />
                <Route exact path='/editproject' component={ EditProject } />
                <Route exact path='/editkpi' component={ EditKpi } />
                <Route path='/editproject/:id' component={ EditProject } />
                <Route path='/editperson/:id' component={ EditPerson } />
                <Route path='/editkpi/:id' component={ EditKpi } />
                <Route exact path='/newproject' component={ NewProject } />
                <Route exact path='/mindmapstatic' component={ MindMapStatic } />
                <Route exact path='/listprojects' component={ ListProjects } />
                <Route exact path='/listpersons' component={ ListPersons } />
                <Route exact path='/listkpis' component={ ListKpis } />
                <Route exact path='/cards' component={ Cards } />
            </Switch>
        </ScrollToTop>
    </BrowserRouter>
)