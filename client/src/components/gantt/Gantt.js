import React, { Component } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import { getOrgId } from "../../redux";
import Button from "@material-ui/core/Button";
import { styles } from "../styles/ProjectStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";

/*
const data = {
  data: [
    { id: 1, text: "Task #1", start_date: "2019-04-15 1:00", duration: 3, progress: 0.6 },
    { id: 2, text: "Task #2", start_date: "2019-04-18 9:00", parent: 1, duration: 3, progress: 0.4 },
    { id: 3, text: "Task #3", start_date: "2019-04-19 9:00", parent: 1, duration: 7, progress: 0.3 },
    { id: 4, text: "Task #4", start_date: "2019-04-22 9:00", parent: 3, duration: 6, progress: 0.1 },
    { id: 5, text: "Task #5", start_date: "2019-04-27 9:00", duration: 4, progress: 0.4 }
  ],
  links: [
    { id: 1, source: 1, target: 2, type: "0" },
    { id: 3, source: 1, target: 4, type: "0" }
  ]
};
const data2 = {
  data: [
    {
      "id": 1,
      "text": "Gathering data",
      "start_date": "2019-06-10",
      "end_date": "2019-07-14",
      "type": "milestone",
      "parent": null,
      "duration": null
    },
    {
      "id": 2,
      "text": "Initial analysis",
      "start_date": "2019-07-15",
      "end_date": "2019-08-15",
      "type": "milestone",
      "parent": null,
      "duration": null
    },
    {
      "id": 3,
      "text": "Further analyses complete",
      "start_date": "2019-08-18",
      "end_date": "2019-09-27",
      "type": "milestone",
      "parent": null,
      "duration": null
    }
  ]
}
 */

class Gantt extends React.Component {
  constructor(props) {
    super(props);
    this.setZoom = this.setZoom.bind(this);
    this.handleZoomChange = this.handleZoomChange.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.state = {
      project: {},
      projectId: undefined,
      scale: 'Quarters',
      organizations: [],
      tasks: null,
      isNewGantt: undefined
    };
  }

  handleSave(event) {
    event.preventDefault();
    // See if there is output here
    let ganttJson = gantt.serialize('json');
    console.log(ganttJson);
    const projectId = this.props.projectId;

    let postData = {
      orgId: getOrgId(),
      projectId: projectId,
      jsonData: JSON.stringify(ganttJson)
    };

    let apiPath = "";
    let successMessage = "";
    let method = "";

    if (this.state.isNewGantt) {
      // For create
      apiPath = "/api/gantt";
      successMessage = "Gantt chart created."
      method = "POST";
    } else {
      // For updates - use PUT
      apiPath = "/api/gantt/" + projectId;
      successMessage = "Gantt chart updated."
      method = "PUT";
    }

    setTimeout(() => {
      fetch(apiPath, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(postData)
      })
        .then( () => {
          console.log("Going to log message: " + successMessage);
          this.props.messages(successMessage);
          this.setState({ isNewGantt: false });
        })
        .catch(err => {
          this.setState({ message: "Error occurred." });
        });
    }, 2000);
  }

  handleZoomChange = event => {
    const zoomSetting = event.target.value;
    this.setState({ scale: event.target.value });
    this.setZoom(zoomSetting);
    gantt.render();
  }

  setZoom = value => {
    switch (value) {
      case "Hours":
        gantt.config.scale_unit = "day";
        gantt.config.date_scale = "%d %M";

        gantt.config.scale_height = 60;
        gantt.config.min_column_width = 30;
        gantt.config.subscales = [
          { unit:"hour", step:1, date:"%H" }
        ];
        break;
      case "Days":
        gantt.config.min_column_width = 70;
        gantt.config.scale_unit = "week";
        gantt.config.date_scale = "#%W";
        gantt.config.subscales = [
          { unit: "day", step: 1, date: "%d %M" }
        ];
        gantt.config.scale_height = 60;
        break;
      case "Months":
        gantt.config.min_column_width = 70;
        gantt.config.scale_unit = "month";
        gantt.config.date_scale = "%F";
        gantt.config.scale_height = 60;
        gantt.config.subscales = [
          { unit:"week", step:1, date:"#%W" }
        ];
        break;
      case "Quarters":
        gantt.config.min_column_width = 70;
        gantt.config.scale_unit = "quarter";
        gantt.config.date_scale = "%F";
        gantt.config.scale_height = 60;
        gantt.config.subscales = [
          { unit:"month", step:1, date:"%M" }
        ];
        break;
      default:
        break;
    }
    // gantt.init("gantt");
  }

  zoomIn = () => {
    gantt.ext.zoom.zoomIn();
  }
  zoomOut = () => {
    gantt.ext.zoom.zoomOut();
  }

  componentDidMount() {
    const projectId = this.props.projectId;
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    let myTasks = {
      data: [],
      links: []
    };

    if (parseInt(projectId) > 0) {
      fetch(`/api/gantt/${projectId}`)
        .then(res => res.json())
        .then(tasks => {
          if (tasks.length > 0 ){
            // Note that we're not setting state here, at least yet.
            myTasks = tasks[0].jsonData;
            this.setState({
              isNewGantt: false
            });
          } else {
            // new chart
            this.setState({
              isNewGantt: true
            });
          }
        })
        .then(milestones => {
          // myTasks.data = this.state.tasks;
          gantt.init(this.ganttContainer);
          gantt.parse(myTasks);
        });
    }
  }

  render() {
    this.setZoom("Quarters");
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink id="select-scale-label">Scale</InputLabel>
              <Select
                labelId={"select-scale-label"}
                value={this.state.scale}
                onChange={this.handleZoomChange}
                inputProps={{
                  name: "scale",
                  id: "scale"
                }}
              >
                <MenuItem value={"Days"}>Days</MenuItem>
                <MenuItem value={"Months"}>Months</MenuItem>
                <MenuItem value={"Quarters"}>Quarters</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <div
              ref={ (input) => { this.ganttContainer = input } }
              style={ { width: 1400, height: 600 } }
            >
            </div>
            <div>
              <br/>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSave}
                className={classes.secondary}
              >
              Save
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Gantt);
