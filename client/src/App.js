import React, {Component} from 'react';
import './App.css';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import EnhancedTable from './EnhancedTable';
import Dashboard from "./dashboard";
import SimpleTable from "./SimpleTable";

function createData(fullname, username, email, orgId) {
    return { fullname, username, email, orgId };
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
                <Typography component="div">
                    <h1>Users</h1>
                    {this.state.users.map(user =>
                        <div key={user.id}>{user.username}, {user.fullName}</div>
                    )}


                    <EnhancedTable />

                </Typography>
            </div>);
    }

}
export default App;

