// Main routes component for react Router.
import React from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Cards from './components/Cards';
import Main2 from './components/Main2';
import ScrollToTop from './components/ScrollTop';
import EditPerson from './components/EditPerson';
import EditKpi from './components/EditKpi';
import ListProjects from './components/ListProjects';
import ListPersons from './components/ListPersons';
import ListKpis from './components/ListKpis';
import MindMapStatic from './components/MindMapStatic';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Logout from './components/Logout';
import Login from './components/Login';
import ProjContainer from './components/project/ProjContainer';
import ProjectCard from './components/ProjectCard';


export default props => (
    <BrowserRouter>
        <ScrollToTop>
            <Switch>
                <Route exact path='/' component={ Main2 } />
                <Route exact path='/dashboard' component={ Dashboard } />
                <Route exact path='/logout' component={ Logout } />
                <Route exact path='/login' component={ Login } />
                <Route exact path='/signin' component={ Signin } />
                <Route exact path='/signup' component={ Signup } />
                <Route exact path='/projcontainer' component={ ProjContainer } />
                <Route exact path='/projectcard' component={ ProjectCard } />
                <Route exact path='/editkpi' component={ EditKpi } />
                <Route path='/projectcard/:id' component={ ProjectCard } />
                <Route path='/editperson/:id' component={ EditPerson } />
                <Route path='/editkpi/:id' component={ EditKpi } />
                <Route exact path='/mindmapstatic' component={ MindMapStatic } />
                <Route exact path='/listprojects' component={ ListProjects } />
                <Route exact path='/listpersons' component={ ListPersons } />
                <Route exact path='/listkpis' component={ ListKpis } />
                <Route exact path='/cards' component={ Cards } />
            </Switch>
        </ScrollToTop>
    </BrowserRouter>
);