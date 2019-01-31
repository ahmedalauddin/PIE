import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ButtonBar from '../buttons/ButtonBar';
import {styles} from '../MaterialSense';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {getSorting, stableSort} from '../TableFunctions';

class ProjectTitleSectionEditable extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        project: '',
        isEditing: false,
        isNew: false,
        org: '',
        organizations: [],
        labelWidth: 0,
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    componentDidMount() {
        fetch('/api/organizations/')
            .then(results => results.json())
            .then(organizations => this.setState({organizations}));
        //this.setState({
        //labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        //});
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.inline}>
                <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                    Project - this should be {this.props.title}
                </Typography>
                <TextField
                    required
                    id="standard-required"
                    label="Project Title"
                    defaultValue="{this.props.title}"
                    className={classes.textField}
                    margin="normal"
                />
                <Typography variant="h5" component="h2">
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="organization-simple">Organization</InputLabel>
                        <Select
                            value={this.state.org}
                            onChange={this.handleChange}
                            inputProps={{
                                name: 'organization',
                                id: 'organization-simple',
                            }}
                        >
                            <MenuItem value="">
                                None
                            </MenuItem>
                            {stableSort(this.state.organizations, getSorting('asc', 'name'))
                                .map(organizations => {
                                    return (
                                        <MenuItem value="{organizations.id}">{organizations.name}</MenuItem>
                                    );
                                })}
                        </Select>
                    </FormControl>
                </Typography>
            </div>
        );
    }
}

export default withStyles(styles)(ProjectTitleSectionEditable);