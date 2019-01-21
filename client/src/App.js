import React, {Component} from 'react';
import './App.css';
import Dashboard from "./dashboard";
import routes from "./routes";
import MenuAppBar from "./MenuAppBar";

const App = () => (
    <div>
        <MenuAppBar/>
        <Dashboard />

    </div>
);

export default App;

