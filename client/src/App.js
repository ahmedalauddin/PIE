import React, {Component} from 'react';
import './App.css';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import EnhancedTable from './EnhancedTable';
import Dashboard from "./dashboard";
import AppDrawer from "./AppDrawer";

function createData(fullname, username, email, orgId) {
    return {fullname, username, email, orgId};
};


class App extends Component {
    state = {users: []};

    componentDidMount() {
        fetch('/api/person')
            .then(res => res.json())
            .then(users => this.setState({users}));
    };

    render() {
        return (
            <div className="App">
                <div>
                    <AppDrawer/>
                </div>
                <div>
                    <Typography component="div">
                        <EnhancedTable/>
                    </Typography>
                </div>
            </div>);
    }

}

export default App;

