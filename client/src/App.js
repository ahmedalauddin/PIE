import React, {Component} from 'react';
import './App.css';
import Typography from "@material-ui/core/Typography";
import Table from './Table';
import Dashboard from "./dashboard";


class App extends Component {
    state = {users: []};

    componentDidMount() {
        fetch('/api/person')
            .then(res => res.json())
            .then(users => this.setState({users}));
    }

    render() {
        return (
            <div className="App">
                <Typography component="div">
                    <Dashboard/>

                    <h1>Users</h1>
                    {this.state.users.map(user =>
                        <div key={user.id}>{user.username}</div>
                    )}

                    <Table
                        data={this.state.users}
                        header={[
                            {
                                name: "Full Name",
                                prop: "fullname"
                            },
                            {
                                name: "Username",
                                prop: "username"
                            },
                            {
                                name: "Email",
                                prop: "email"
                            },
                            {
                                name: "Org ID",
                                prop: "orgId"
                            }
                        ]}
                    />
                </Typography>
            </div>);
    }
}

export default App;
