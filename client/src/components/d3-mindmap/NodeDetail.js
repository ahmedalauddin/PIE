/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/NodeDetail.js
 * Created:  2019-06-24
 * Descr:    Provides ability to create KPI and project from mindmap node.
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-09-22
 * Editor:   Brad Kaufman
 * Changes:  Adding selected node text.
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Redirect } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { getOrgId } from "../../redux";
import {red} from "@material-ui/core/colors";
import Checkbox from "@material-ui/core/Checkbox";
import TableCell from "@material-ui/core/TableCell";

const styles = theme => ({
  grid: {
    width: 1200,
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    color: theme.palette.text.secondary
  },
  rangeLabel: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.unit * 2
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32
  },
  outlinedButton: {
    textTransform: "uppercase",
    margin: theme.spacing.unit
  },
  actionButton: {
    textTransform: "uppercase",
    margin: theme.spacing.unit,
    width: 152
  },
  blockCenter: {
    padding: theme.spacing.unit * 2,
    textAlign: "center"
  },
  block: {
    padding: theme.spacing.unit * 2
  },
  box: {
    marginBottom: 40,
    height: 65
  },
  inlining: {
    display: "inline-block",
    marginRight: 10
  },
  buttonBar: {
    display: "flex"
  },
  alignRight: {
    display: "flex",
    justifyContent: "flex-end"
  },
  noBorder: {
    borderBottomStyle: "hidden"
  },
  loadingState: {
    opacity: 0.05
  },
  loadingMessage: {
    position: "absolute",
    top: "40%",
    left: "40%"
  },
  card: {
    maxWidth: 1000
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textFieldWide: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  },
  spaceTop: {
    marginTop: 50
  }
});

class NodeDetail extends React.Component {
  constructor(props) {
    super(props);
    // Make sure to .bind the handleSubmit to the class.  Otherwise the API doesn't receive the
    // state values.
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchKpiDetail = this.fetchKpiDetail.bind(this);
  };

  state = {
    kpiId: undefined,
    title: undefined,
    orgId: 0,
    description: undefined,
    formula: undefined,
    project: undefined,
    projectId: undefined,
    projectDescription: undefined,
    mindmapNodeId: undefined,
    hasError: "",
    startAt: "",
    endAt: "",
    message: "",
    buttonText: undefined,
    isEditing: false,
    redirect: false,
    isNew: false
  };

  // For the snackbar
  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  // For the snackbar
  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  anotherFunction = () => {
    this.props.showMessages(this.state.message);
  };

  handleSubmit(event) {
    event.preventDefault();

    const kpiId = this.state.kpiId;
    let apiPath = "";
    let successMessage = "";
    let method = "";

    if (kpiId > 0) {
      // For updates
      apiPath = "/api/kpis/" + kpiId;
      successMessage = "KPI '" + this.state.title + "' updated.";
      method = "PUT";
    } else {
      // For create
      method = "POST";
      if (this.state.project === "") {
        // Create KPI only
        apiPath = "/api/kpis/";
        successMessage = "KPI '" + this.state.title + "' created.";
      } else {
        // Create KPI and a project.
        apiPath = "/api/kpis-with-project/";
        successMessage = "KPI '" + this.state.title + "' created with project '" +
          this.state.project + "'";
      }
    }

    setTimeout(() => {
      fetch(apiPath, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state)
      })
        .then(() => {
          // Redirect to the Project component.
          this.setState({
            buttonText: "Update KPI",
            message: successMessage
          });
          this.props.messages(successMessage);
        })
        .catch(err => {
          console.log(err);
        });
    }, 2000);
  }

  fetchKpiDetail = () => {
    let selectedNodeId = this.props.nodeId;
    console.log("NodeDetail.js, selectedNodeId:" + selectedNodeId);

    if (selectedNodeId !== "") {
      // Update KPI
      fetch(`/api/kpis-mindmapnode/${selectedNodeId}`)
        .then(res => res.json())
        .then(kpi => {
          if (kpi[0]) {
            this.setState({
              title: kpi[0].title,
              kpiId: kpi[0].id,
              description: kpi[0].description,
              project: kpi[0].project,
              projectDescription: kpi[0]. projectDescription,
              formula: kpi[0].formulaDescription,
              mindmapNodeId: selectedNodeId,
              orgId: getOrgId(),
              buttonText: "Update KPI"
            });
          } else {
            this.setState({
              title: "",
              kpiId: "",
              description: "",
              formula: "",
              project: "",
              projectDescription: "",
              mindmapNodeId: selectedNodeId,
              orgId: getOrgId(),
              buttonText: "Create KPI"
            });
          }
        });
    } else {
      // Create KPI
      this.setState({
        title: "",
        kpiId: "",
        description: "",
        formula: "",
        project: "",
        projectDescription: "",
        mindmapNodeId: selectedNodeId,
        orgId: getOrgId(),
        isEditing: true,
        buttonText: "Create KPI"
      });
    }
  };

  componentDidMount() {
    this.fetchKpiDetail();
  }

  componentDidUpdate(prevProps) {
    if (this.props.nodeId !== prevProps.nodeId) {
      this.fetchKpiDetail();
    }
  };

  componentDidCatch() {
    return <Redirect to="/Login" />;
  }

  render() {
    const { classes } = this.props;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (
      <div className={classes.paper}>
        <form onSubmit={this.handleSubmit} noValidate>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {this.props.text}
              </Typography>
              <Typography variant="h7" gutterBottom>
                KPI
              </Typography>
              <TextField
                id="title"
                label="KPI Title"
                onChange={this.handleChange("title")}
                value={this.state.title}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                id="title"
                label="Description"
                onChange={this.handleChange("description")}
                value={this.state.description}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                id="formula"
                label="KPI Formula"
                multiline
                rowsMax="4"
                value={this.state.formula}
                onChange={this.handleChange("formula")}
                fullWidth
                className={classes.textFieldWide}
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
              /><br /><br /><br /><br />
              <Typography variant="h7" gutterBottom>
                Project
              </Typography>
              <TextField
                id="title"
                label="Project Title"
                onChange={this.handleChange("project")}
                value={this.state.project}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                id="projectDescription"
                label="Project Description"
                onChange={this.handleChange("projectDescription")}
                value={this.state.projectDescription}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
              />
              <br /><br />
              <Typography component="p">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleSubmit}
                  className={classes.secondary}
                >
                  {this.state.buttonText}
                </Button>
              </Typography>
              <br />
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(NodeDetail);
