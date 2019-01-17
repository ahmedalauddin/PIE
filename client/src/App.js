import React, {Component} from 'react';
import './App.css';
import EnhancedTable from './EnhancedTable';
import Dashboard from "./dashboard";

class App extends Component {
    render() {
        return (
            <div className="App">
                <div>
                    <Dashboard/>
                </div>
            </div>);
    }
}

export default App;

