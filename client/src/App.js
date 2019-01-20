import React, {Component} from 'react';
import './App.css';
import Dashboard from "./dashboard";
import ReactDOM, {render} from "react-dom";
import Header from "./header";
import routes from "./routes";
import ButtonAppBar from "./ButtonAppBar";

const App = () => (
    <div>
        <Header />
        <ButtonAppBar/>
        <Dashboard />
        <routes />
    </div>
)

export default App;

