// Main routes component for react Router.
import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import HighlightDashboard from "./components/dashboard/HighlightDashboard";
import OrgDashboard from "./components/organization/OrgDashboard";
import Cards from "./components/cards/Cards";
import ScrollToTop from "./components/ScrollTop";
import EditPerson from "./components/person/EditPerson";
import ListPersons from "./components/person/ListPersons";
import ListActions from "./components/actions/ListActions";
import ListKpis from "./components/kpi/ListKpis";
import ListOrgs from "./components/organization/ListOrgs";
import MindMap from "./components/mindmap/MindMap";
import Main from "./components/Main";
import Signup from "./components/auth/Signup";
import Logout from "./components/auth/Logout";
import Login from "./components/auth/Login";
import UserInfo from "./components/person/UserInfo";
import ClientOrg from "./components/organization/ClientOrg";
import ProjectPersons from "./components/project/ProjectPersons";
import Project from "./components/project/Project";
import NewProject from "./components/project/NewProject";
import Action from "./components/actions/Action";
import ProjectDashboard from "./components/dashboard/ProjectDashboard";
import PanelDashboard from "./components/dashboard/PanelDashboard";
import About from "./components/About";
import Organization from "./components/organization/Organization";
import KpiCard from "./components/kpi/KpiCard";
import Person from "./components/person/Person";
import MyDraft from "./components/project/MyDraft";
import Kpi from "./components/kpi/Kpi";
import Milestone from "./components/milestone/Milestone";
import Analytics from "./components/analytics/Analytics";
import Test1 from "./components/project/Test1";
import withAuth from "./components/withAuth.jsx";
import ListDepartments from "./components/department/ListDepartments";
import Department from "./components/department/Department";

export default props => (
  <BrowserRouter>
    <ScrollToTop>
      <Switch>
        <Route exact path="/dashboard" component={withAuth(ProjectDashboard)} />
        <Route exact path="/paneldashboard" component={withAuth(PanelDashboard)} />
        <Route exact path="/orgdashboard" component={withAuth(OrgDashboard)} />
        <Route exact path="/highlight" component={withAuth(HighlightDashboard)} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/about" component={About} />
        <Route exact path="/draft" component={MyDraft} />
        <Route exact path="/" component={Main} />
        <Route exact path="/userinfo" component={UserInfo} />
        <Route exact path="/test" component={Test1} />
        <Route exact path="/clientorg" component={withAuth(ClientOrg)} />
        <Route exact path="/analytics" component={withAuth(Analytics)} />
        <Route exact path="/project" component={withAuth(Project)} />
        <Route exact path="/department" component={withAuth(Department)} />
        <Route path="/project/:id" component={withAuth(Project)} />
        <Route path="/projectpersons/:id" component={withAuth(ProjectPersons)} />
        <Route path="/organization/:id" component={withAuth(Organization)} />
        <Route path="/editperson/:id" component={withAuth(EditPerson)} />
        <Route path="/listkpis/:id" component={withAuth(ListKpis)} />
        <Route path="/listdepartments/:id" component={withAuth(ListDepartments)} />
        <Route path="/department/:id" component={withAuth(Department)} />
        <Route path="/listactions/:id" component={withAuth(ListActions)} />
        <Route exact path="/projectdashboard" component={withAuth(ProjectDashboard)} />
        <Route exact path="/newproject" component={withAuth(NewProject)} />
        <Route exact path="/kpicard/:id" component={withAuth(KpiCard)} />
        <Route exact path="/kpicard" component={withAuth(KpiCard)} />
        <Route exact path="/person/:id" component={withAuth(Person)} />
        <Route exact path="/person" component={withAuth(Person)} />
        <Route exact path="/kpi" component={withAuth(Kpi)} />
        <Route exact path="/milestone" component={withAuth(Milestone)} />
        <Route exact path="/action/:id" component={withAuth(Action)} />
        <Route exact path="/action" component={withAuth(Action)} />
        <Route exact path="/mindmap" component={withAuth(MindMap)} />
        <Route exact path="/listpersons" component={withAuth(ListPersons)} />
        <Route exact path="/listkpis" component={withAuth(ListKpis)} />
        <Route exact path="/listorgs" component={withAuth(ListOrgs)} />
        <Route exact path="/cards" component={Cards} />
      </Switch>
    </ScrollToTop>
  </BrowserRouter>
);
