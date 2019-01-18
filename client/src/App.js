import React, {Component} from 'react';
import './App.css';
import Dashboard from "./dashboard";
import ReactDOM, {render} from "react-dom";
import Header from "./header";
import routes from "./routes";

const App = () => (
    <div>
        <Header />
        <Dashboard />
        <routes />
    </div>
)

export default App;

