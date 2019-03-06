// Main routes component for react Router.
import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Cards from "./components/Cards";
import Main2 from "./components/Main2";
import ScrollToTop from "./components/ScrollTop";
import EditPerson from "./components/EditPerson";
import EditKpi from "./components/EditKpi";
import ListProjects from "./components/ListProjects";
import ListPersons from "./components/ListPersons";
import ListKpis from "./components/ListKpis";
import ListOrgs from "./components/ListOrgs";
import MindMapStatic from "./components/MindMapStatic";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Logout from "./components/Logout";
import Login from "./components/Login";
import ClientOrg from "./components/ClientOrg";
import ProjContainer from "./components/project/ProjContainer";
import ProjectCard from "./components/ProjectCard";
import OrganizationCard from "./components/OrganizationCard";
import KpiCard from "./components/KpiCard";
import withAuth from "./components/withAuth.jsx";
import SelectClient from './components/SelectClient';

export default props => (
  <BrowserRouter>
    <ScrollToTop>
      <Switch>
        <Route exact path="/" component={Main2} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/clientorg" component={withAuth(ClientOrg)} />
        <Route exact path="/selectclient" component={withAuth(SelectClient)} />
        <Route exact path="/projcontainer" component={withAuth(ProjContainer)} />
        <Route exact path="/projectcard" component={withAuth(ProjectCard)} />
        <Route exact path="/editkpi" component={withAuth(EditKpi)} />
        <Route path="/projectcard/:id" component={withAuth(ProjectCard)} />
        <Route path="/listprojects/:id" component={withAuth(ListProjects)} />
        <Route path="/organizationcard/:id" component={withAuth(OrganizationCard)} />
        <Route path="/editperson/:id" component={withAuth(EditPerson)} />
        <Route path="/listkpis/:id" component={withAuth(ListKpis)} />
        <Route exact path="/listprojects" component={withAuth(ListProjects)} />
        <Route exact path="/kpicard/:id" component={withAuth(KpiCard)} />
        <Route exact path="/mindmapstatic" component={MindMapStatic} />
        <Route exact path="/listpersons" component={withAuth(ListPersons)} />
        <Route exact path="/listkpis" component={withAuth(ListKpis)} />
        <Route exact path="/listorgs" component={withAuth(ListOrgs)} />
        <Route exact path="/cards" component={Cards} />
      </Switch>
    </ScrollToTop>
  </BrowserRouter>
);
