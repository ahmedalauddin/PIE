// Main routes component for react Router.
import React from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Cards from './components/Cards';
import Main from './components/Main';
import Main2 from './components/Main2';
import ScrollToTop from './components/ScrollTop';
import NewProject from './components/NewProject';
import EditPerson from './components/EditPerson';
import EditProject from './components/EditProject';
import EditKpi from './components/EditKpi';
import ListProjects from './components/ListProjects';
import ListPersons from './components/ListPersons';
import ListKpis from './components/ListKpis';
import MindMapStatic from './components/MindMapStatic';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Logout from './components/Logout';
import LoginFormContainer from './components/LoginFormContainer';
import ProjContainer from './components/project/ProjContainer';
import ProjectCard from './components/project/ProjectCard';
import ProjectCard2 from './components/ProjectCard';


export default props => (
    <BrowserRouter>
        <ScrollToTop>
            <Switch>
                <Route exact path='/' component={ Main2 } />
                <Route exact path='/dashboard' component={ Dashboard } />
                <Route exact path='/logout' component={ Logout } />
                <Route exact path='/login' component={ LoginFormContainer } />
                <Route exact path='/signin' component={ Signin } />
                <Route exact path='/signup' component={ Signup } />
                <Route exact path='/projectcontainer' component={ ProjContainer } />
                <Route exact path='/projectcard' component={ ProjectCard } />
                <Route exact path='/projectcard2' component={ ProjectCard2 } />
                <Route exact path='/editkpi' component={ EditKpi } />
                <Route path='/projectcard2/:id' component={ ProjectCard2 } />
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
);