import React, { Component } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import {getProject, getProjectName} from "../../redux";

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

export default class Gantt extends Component {
  constructor(props) {
    super(props);
    this.setZoom = this.setZoom.bind(this);
    this.state = {
      project: {},
      organizations: [],
      tasks: null
    };
  }
  setZoom(value) {
    switch (value) {
      case 'Hours':
        gantt.config.scale_unit = 'day';
        gantt.config.date_scale = '%d %M';

        gantt.config.scale_height = 60;
        gantt.config.min_column_width = 30;
        gantt.config.subscales = [
          { unit:'hour', step:1, date:'%H' }
        ];
        break;
      case 'Days':
        gantt.config.min_column_width = 70;
        gantt.config.scale_unit = 'week';
        gantt.config.date_scale = '#%W';
        gantt.config.subscales = [
          { unit: 'day', step: 1, date: '%d %M' }
        ];
        gantt.config.scale_height = 60;
        break;
      case 'Months':
        gantt.config.min_column_width = 70;
        gantt.config.scale_unit = 'month';
        gantt.config.date_scale = '%F';
        gantt.config.scale_height = 60;
        gantt.config.subscales = [
          { unit:'week', step:1, date:'#%W' }
        ];
        break;
      default:
        break;
    }
  }
  componentDidMount() {
    const projectId = this.props.projectId;
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    let tasks = null;
    let myTasks = {
      data: [],
      links: []
    };
    //let myTasks = JSON.stringify(items);

    if (parseInt(projectId) > 0) {
      fetch(`/api/gantt/${projectId}`)
        .then(res => res.json())
        .then(tasks => {
          /*
          this.setState({
            id: projectId,
            tasks: tasks
          }); */
          // let myObj = JSON.parse(myTasks);
          myTasks.data = tasks;
        })
        .then(milestones => {
          // myTasks.data = this.state.tasks;
          gantt.init(this.ganttContainer);
          gantt.parse(myTasks);
        });
    }
  }

  render() {
    this.setZoom("Months");
    return (
      <div
        ref={ (input) => { this.ganttContainer = input } }
        style={ { width: 1500, height: 600 } }
      ></div>
    );
  }
}
