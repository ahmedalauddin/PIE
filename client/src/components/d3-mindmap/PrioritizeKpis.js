/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/PrioritizeKpis.js
 * Created:  2019-07-08
 * Descr:    List prioritized KPIs.
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-08-14
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { getOrgId } from "../../redux";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

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

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 3,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "lightgrey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "white",
  padding: grid,
  width: 500
});

class PrioritizeKpis extends React.Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.fetchKpis = this.fetchKpis.bind(this);
    this.saveKpiPriorities = this.saveKpiPriorities.bind(this);
    this.state = {
      ideas: [],
      items: getItems(10),
      kpis: []
    };
  };

  fetchKpis() {
    // Fetch KPIs by priority
    let organizationId = getOrgId();

    if (organizationId > 0) {
      // Fetch the KPIs only for an organization by priority
      fetch(`/api/kpis-orgpriority/${organizationId}`)
        .then(res => res.json())
        .then(kpis => this.setState({
          kpis: kpis
        }));
    }
  };

  componentDidMount() {
    this.fetchKpis();
  };

  componentDidUpdate(prevProps) {
  };

  saveKpiPriorities() {
    const orgId = getOrgId();
    let successMessage = "";

    setTimeout(() => {
      fetch("/api/kpis-save-priorities/" + orgId, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then( () => {
          console.log("Going to log message: " + successMessage);
          this.setState({
            message: successMessage,
            // readyToRedirect: true
          });
        })
        .catch(err => {
          this.setState({ message: "Error occurred." });
        });
    }, 2000);
  };


  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const kpis = reorder(
      this.state.kpis,
      result.source.index,
      result.destination.index
    );

    this.setState({
      kpis
    });
    this.saveKpiPriorities();
  }

  render() {
    const { classes } = this.props;

    if (this.state.hasError) {
      return <h1>An error occurred.</h1>;
    }

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        Drag KPIs up and down to reorder their priorities.
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.kpis.map((kpi, index) => (
                <Draggable key={kpi.id} draggableId={kpi.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <b>{kpi.title}</b><br/>
                      {kpi.description}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default withStyles(styles)(PrioritizeKpis);
