// Main routes component for react Router.
import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import HighlightDashboard from "./components/HighlightDashboard";
import Cards from "./components/Cards";
import ScrollToTop from "./components/ScrollTop";
import EditPerson from "./components/EditPerson";
import ListProjects from "./components/ListProjects";
import ListPersons from "./components/ListPersons";
import ListActions from "./components/ListActions";
import ListKpis from "./components/ListKpis";
import ListOrgs from "./components/ListOrgs";
import ListDepts from "./components/ListDepts";
import MindMap from "./components/mindmap/MindMap";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Logout from "./components/Logout";
import Login from "./components/Login";
import UserInfo from "./components/UserInfo";
import ClientOrg from "./components/ClientOrg";
import ProjectPersons from "./components/project/ProjectPersons";
import Project from "./components/project/Project";
import NewProject from "./components/project/NewProject";
import ActionCard from "./components/ActionCard";
import ProjectDashboard from "./components/ProjectDashboard";
import PanelDashboard from "./components/PanelDashboard";
import About from "./components/About";
import DepartmentCard from "./components/DepartmentCard";
import OrganizationCard from "./components/OrganizationCard";
import KpiCard from "./components/KpiCard";
import Analytics from "./components/Analytics";
import withAuth from "./components/withAuth.jsx";
// For testing
import TestProject from "./components/project/TestProject";

export default props => (
  <BrowserRouter>
    <ScrollToTop>
      <Switch>
        <Route exact path="/dashboard" component={withAuth(ProjectDashboard)} />
        <Route exact path="/paneldashboard" component={withAuth(PanelDashboard)} />
        <Route exact path="/highlight" component={withAuth(HighlightDashboard)} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/about" component={About} />
        <Route exact path="/" component={Main} />
        <Route exact path="/userinfo" component={UserInfo} />
        <Route exact path="/clientorg" component={withAuth(ClientOrg)} />
        <Route exact path="/analytics" component={withAuth(Analytics)} />
        <Route exact path="/project" component={withAuth(Project)} />
        <Route path="/project/:id" component={withAuth(Project)} />
        <Route path="/projectpersons/:id" component={withAuth(ProjectPersons)} />
        <Route path="/departmentcard/:id" component={withAuth(DepartmentCard)} />
        <Route path="/listprojects/:id" component={withAuth(ListProjects)} />
        <Route path="/organizationcard/:id" component={withAuth(OrganizationCard)} />
        <Route path="/editperson/:id" component={withAuth(EditPerson)} />
        <Route path="/listkpis/:id" component={withAuth(ListKpis)} />
        <Route path="/listdepts/:id" component={withAuth(ListDepts)} />
        <Route path="/listactions/:id" component={withAuth(ListActions)} />
        <Route exact path="/listprojects" component={withAuth(ListProjects)} />
        <Route exact path="/newproject" component={withAuth(NewProject)} />
        <Route exact path="/kpicard/:id" component={withAuth(KpiCard)} />
        <Route exact path="/kpicard" component={withAuth(KpiCard)} />
        <Route exact path="/actioncard/:id" component={withAuth(ActionCard)} />
        <Route exact path="/actioncard" component={withAuth(ActionCard)} />
        <Route exact path="/mindmap" component={withAuth(MindMap)} />
        <Route exact path="/listpersons" component={withAuth(ListPersons)} />
        <Route exact path="/listkpis" component={withAuth(ListKpis)} />
        <Route exact path="/listorgs" component={withAuth(ListOrgs)} />
        <Route exact path="/cards" component={Cards} />
        <Route exact path="/testproject" component={TestProject} />
      </Switch>
    </ScrollToTop>
  </BrowserRouter>
);
