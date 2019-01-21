import React from 'react'
import Dashboard from "./dashboard";
import {Route} from "react-router-dom";
import ProjectForm from "./ProjectForm";
import Toolbar from "./MenuAppBar";

const Home = () => (
    <div>
        <Route exact path="/" component={Home}/>
        <Route path="/Dashboard" component={Dashboard}/>
        <Route path="/ProjectForm" component={ProjectForm}/>
    </div>
);

export default Home;