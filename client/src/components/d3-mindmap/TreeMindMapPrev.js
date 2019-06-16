/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/TreeMindMap.js
 * Descr:    D3 mind map.  See examples on https://observablehq.com/@jianan-li/mind-map-with-data-persistence-wip.
 * Created:  2019-06-05
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-06-12
 * Editor:   Brad Kaufman
 */
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Topbar from "../Topbar";
import withStyles from "@material-ui/core/styles/withStyles";
import * as d3 from "d3";
import { red, grey } from "@material-ui/core/colors";
import "./tree-styles.scss";
import Grid from "@material-ui/core/Grid/index";
import Button from "@material-ui/core/Button";

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
const jsonData = {
  "id": "_ns1nvi0ai",
  "name": "Root",
  "children": [
    {
      "id": "_o4r47dq71",
      "name": "Reduce operating costs",
      "children":
        [
          {
            "id": "_al6om6znz",
            "name": "Reduce inventory",
            "children": [
              {
                "id": "_46ct4o4oy",
                "name": "Review part models"
              },
              {
                "id": "_ea00nojwy",
                "name": "Optimize supply chain"
              }
            ]
          }, {
          "id": "_z3uk0721f",
          "name": "Operating procedures"
        }
        ]
    }, {
      "id": "_uajrljib9",
      "name": "Review supply chain processes"
    }, {
      "id": "_uguzpgdta",
      "name": "Introduce automation"
    }
  ]};
// Use this alternate JSON data to test a new mind map, starting only with root.
const jsonDataX = {
  "id": "_ns1nvi0ai",
  "name": "Root"
};
const dx = 80;
const dy = 243.75;
const width = 1000;
const margin = ({top: 40, right: 120, bottom: 40, left: 80});

class TreeMindMapPrev extends React.Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.chart = this.chart.bind(this);
    this.appendChildToSelectedNode = this.appendChildToSelectedNode.bind(this);
    this.addSiblingToSelectedNode = this.addSiblingToSelectedNode.bind(this);
    this.editNode = this.editNode.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.deselectNode = this.deselectNode.bind(this);
    this.updateNodeValue = this.updateNodeValue.bind(this);
    this.handleKeypressEsc = this.handleKeypressEsc.bind(this);
    this.handleClickOnNode = this.handleClickOnNode.bind(this);
    this.handleClickOnCanvas = this.handleClickOnCanvas.bind(this);
    this.removeSelectedNode = this.removeSelectedNode.bind(this);
    this.ID = this.ID.bind(this);
    console.log("Hit TreeMindMap constructor.");
  }

  state = {
    width: 700,
    height: 500,
    svg: d3.select(this.svg),
    data2: [
      { name: "ProjectA", parent: "" },
      { name: "ApplicationA", parent: "ProjectA" },
      { name: "EnvironmentB", parent: "ProjectA" },

      { name: "TierC", parent: "ApplicationA" },
      { name: "TierD", parent: "ApplicationA" },
      { name: "TierE", parent: "ApplicationA" },

      { name: "ServiceF", parent: "EnvironmentB" },

      { name: "ContainerG", parent: "TierE" },
      { name: "ContainerH", parent: "TierE" }
    ],
    data: [
      { name: "Main KPI", parent: "" },
      { name: "Reduce waste", parent: "Main KPI" },
      { name: "Lower inventory", parent: "Main KPI" },
      { name: "Increase uptime", parent: "Main KPI" },
      { name: "Reduce replacement time", parent: "Increase uptime" },
      { name: "Lower unnecessary inventory", parent: "Increase uptime" },
      { name: "Reduce costs for inventory", parent: "Increase uptime" },
      { name: "Optimize supply chain", parent: "Lower inventory" },
      { name: "Tag inventory", parent: "Lower unnecessary inventory" },
      { name: "Eliminate incorrect parts", parent: "Tag inventory" }
    ],
    data3: {
      name: "Root",
      children: [
        {
          name: "Branch 1",
          children: [{ name: "Leaf 3" }, { name: "Leaf 4" }]
        },
        { name: "Branch 2" }
      ]
    },
    diagonal: d3.linkHorizontal().x(d => d.y).y(d => d.x),
    tree: d3.tree().nodeSize([dx, dy])
  };

  ID = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  appendChildToSelectedNode = (svg) => {
    console.log("appendChildToSelectedNode");
    let idOfSelectedNode = svg
      .selectAll("g.node")
      .filter(".node-selected")
      .attr("id");

    console.log("idOfSelectedNode: " + idOfSelectedNode);

    let nodeInTree = [jsonData];

    let nodeFound = false;
    let parent = null;

    while (nodeInTree.length != 0) {
      let allCurrentLevelChildren = [];
      for (let node of nodeInTree) {
        if (node.children) {
          allCurrentLevelChildren = allCurrentLevelChildren.concat(node.children);
        }
        if (node.id === idOfSelectedNode) {
          nodeFound = true;
          parent = node;
        }
      }
      if (nodeFound) break;
      else {
        nodeInTree = allCurrentLevelChildren;
      }
    }

    let child = {
      name: "",
      id: this.ID()
    };

    if (parent.children) parent.children.push(child);
    else parent.children = [child];

    this.update(svg);
  };

  addSiblingToSelectedNode = (svg) => {
    let idOfSelectedNode = svg
      .selectAll("g.node")
      .filter(".node-selected")
      .attr("id");

    console.log("idOfSelectedNode: " + idOfSelectedNode);

    let parentNodes = [jsonData];
    let nodeFound = false;
    let parent = null;

    while (parentNodes.length !== 0) {
      let allNextLevelParents = [];
      for (let node of parentNodes) {
        if (node.children) {
          allNextLevelParents = allNextLevelParents.concat(node.children);
          if (node.children.map(child => child.id).includes(idOfSelectedNode)) {
            nodeFound = true;
            parent = node;
          }
        }
      }
      if (nodeFound) break;
      else {
        parentNodes = allNextLevelParents;
      }
    }

    let child = {
      id: this.ID()
    };
    parent.children.push(child);
    this.update(svg);
  };

  chart = () => {
    // Create the SVG
    // As you an see, the svg is initialized with height = dx.
    // This will be updated later when the rest of the nodes in the tree are entered.

    // const svg = d3.create("svg");
    // append to body, see https://blog.logrocket.com/data-visualization-in-react-using-react-d3-c35835af16d0/
    let svg = d3.select(this.svg)
      .attr("width", width)
      .attr("height", dx)
      .style("font", "12px sans-serif")
      .on("click", this.handleClickOnCanvas);

    /*
    this.setState({
      //d3: d3,
      svg: this.svg
    });
     */

    // 2.1 Create a container for all the nodes in the graph
    const gNode = svg
      .append("g")
      .attr("id", "nodes")
      .attr("cursor", "pointer");

    // 2.2 Create a container for all the links in the graph
    const gLink = svg
      .append("g")
      .attr("id", "links")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    // 3. Fill in the nodes and links with the hierarchy data
    this.update(svg);
    let appendChildToSelectedNode = this.appendChildToSelectedNode;
    let addSiblingToSelectedNode = this.addSiblingToSelectedNode;
    let removeSelectedNode = this.removeSelectedNode;
    let handleKeypressEsc = this.handleKeypressEsc;

    // 4. Register other event handlers
    d3.select("body")
      .on("keydown", function(e) {
        console.log(`keydown: ${d3.event.keyCode}`);
        // Check to see if a node is being edited
        let nodeIsBeingEdited = gNode.select("g.node-editing").size();

        if (d3.event.keyCode === 9) {
          console.log("tab - append child to selected node");
          appendChildToSelectedNode(svg);
        } else if(d3.event.keyCode === 13 && !nodeIsBeingEdited) {
          console.log("enter - add sibling to selected node");
          addSiblingToSelectedNode(svg);
        } else if(d3.event.keyCode == 8 && !nodeIsBeingEdited) {
          console.log("delete - remove selected node");
          removeSelectedNode(svg);
        } else if(d3.event.keyCode == 27) {
          console.log("esc - deselect node");
          handleKeypressEsc(svg);
        }
      });

    return this.state.svg.node();
  };

  handleKeypressEsc = (svg) => {
    svg
      .selectAll('g.node')
      .filter(".node-selected")
      .each(this.deselectNode);
  };

  handleClickOnNode = (d,i,nodes) => {
    console.log("handleClickOnNode: clicked on a node.");
    const currentlySelectedNode =
      d3.selectAll(nodes)
        .filter('.node-selected')

    const clickedNodeIndex = i
    const clickedNode = nodes[clickedNodeIndex]
    const clickedNodeID = d3.select(clickedNode).attr("name");
    const otherNodes = d3.selectAll(nodes).filter((d,i) => i!== clickedNodeIndex);

    if (currentlySelectedNode.size() > 0 && currentlySelectedNode.attr("name") === clickedNodeID) {
      console.log('going into editing mode!')
      d3.select(clickedNode)
        .call(this.editNode);
    } else {
      d3.select(clickedNode)
        .call(this.selectNode);

      // If not already selected, mark as selected
      otherNodes
        .each(this.deselectNode);
    }

    // d.children = d.children ? null : d._children;
    // update(d);

    // Prevent triggering clickOnCanvas handler
    // https://stackoverflow.com/questions/22941796/attaching-onclick-event-to-d3-chart-background
    d3.event.stopPropagation();
  };

  removeSelectedNode = (svg) => {
    let idOfSelectedNode = svg
      .selectAll("g.node")
      .filter(".node-selected")
      .attr("id");
    let parentNodes = [jsonData];
    let nodeFound = false;
    let parent;

    while (parentNodes.length != 0) {
      let allNextLevelParents = [];
      for (let node of parentNodes) {
        if (node.children) {
          allNextLevelParents = allNextLevelParents.concat(node.children);
          if (node.children.map(child => child.id).includes(idOfSelectedNode)) {
            nodeFound = true;
            parent = node;
          }
        }
      }
      if (nodeFound) break;
      else {
        parentNodes = allNextLevelParents;
      }
    }
    parent.children = parent.children.filter(child => child.id !== idOfSelectedNode);
    parent.children.length === 0 && delete parent.children;

    this.update(svg);
    // updateJSONOnServer();
  };

  editNode = (node) => {
    node
      .classed("node-editing", true)
      .select("foreignObject")
      .select("p")
      .style("background-color", "#ddd");
    console.log(`${node.attr("name")} is being edited`);
  };

  selectNode = (node) => {
    node
      .classed("node-selected", true)
      .select("foreignObject")
      .select("p")
      .attr("contenteditable", "true")
      .style("background-color", "#ddd")
    console.log(`${node.attr("name")} selected`);
  };

  deselectNode = (d,i,nodes) => {
    let idOfSelectedNode =
      d3.select(nodes[i])
        .attr("id");

    let newValue =
      d3.select(nodes[i])
        .select("foreignObject")
        .select("p")
        .html();

    d3.select(nodes[i])
      .classed("node-editing", false)
      .classed("node-selected", false)
      .select("foreignObject")
      .select("p")
      .attr("contenteditable", "false")
      .style("background-color", null);

    this.updateNodeValue(idOfSelectedNode, newValue);
  };

  updateNodeValue = (idOfSelectedNode, newValue) => {
    let nodeInTree = [jsonData];

    let nodeFound = false;
    let parent = null;

    while (nodeInTree.length != 0) {
      let allCurrentLevelChildren = []
      for (let node of nodeInTree) {
        if (node.children) {
          allCurrentLevelChildren = allCurrentLevelChildren.concat(node.children);
        }
        if (node.id === idOfSelectedNode) {
          nodeFound = true;
          parent = node;
        }
      }
      if (nodeFound) break;
      else {
        nodeInTree = allCurrentLevelChildren;
      }
    }
    parent.name = newValue;
  };

  handleClickOnCanvas = (d,i,nodes) => {
    /*
    let { d3 } = this.state;
    console.log("handleClickOnCanvas, nodes: " + nodes[i]);
    d3.select(nodes[i])
      .selectAll('g.node')
      .filter(".node-selected")
      .each(this.deselectNode); */
  };

  update = (svg) => {
    // d3.hierarchy object is a data structure that represents a hierarchy
    // It has a number of functions defined on it for retrieving things like
    // ancestor, descendant, and leaf nodes, and for computing the path between nodes
    // const root = d3.hierarchy(treeData);
    debugger;
    const root = d3.hierarchy(jsonData);

    root.x0 = dy / 2;
    root.y0 = 0;

    root.descendants().forEach((d, i) => {
      // console.log(d)
      // console.log(i)
      d.id = d.data.id;
      d._children = d.children;
    });

    const duration = 100;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    this.state.tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top + margin.bottom;
    const transition = svg
      .transition()
      .duration(duration)
      .attr("height", height)
      .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
      .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes
    const existingNodeContainers = svg.select("#nodes").selectAll("g").data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    // Create new node containers that each contains a circle and a text label
    const newNodeContainers = existingNodeContainers.enter().append("g")
      .attr("id", (d, i) => `${d.id}`)
      .attr("class", "node")
      .attr("transform", d => `translate(${root.y0},${root.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)

    newNodeContainers.append("circle")
      .attr("r", 10)
      .attr("fill", d => d._children ? "#555" : "#999");

    newNodeContainers.append("foreignObject")
      .attr("x", -80)
      .attr("y", -35)
      .attr("width", 150)
      .attr("height", 40)
      .append("xhtml:p")
      .text(d => d.data.name)

    existingNodeContainers.merge(newNodeContainers)
      .on("click", this.handleClickOnNode);

    // Transition nodes to their new position.
    // Increase opacity from 0 to 1 during transition
    const nodeUpdate = existingNodeContainers.merge(newNodeContainers).transition(transition)
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    // Reduce opacity from 1 to 0 during transition
    const nodeExit = existingNodeContainers.exit().transition(transition).remove()
      .attr("transform", d => `translate(${root.y},${root.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);


    // Update the links…
    const existingLinkPaths = svg.select('#links').selectAll("path").data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const newLinkPaths = existingLinkPaths.enter().append("path")
      .attr("d", d => {
        const o = {x: root.x0, y: root.y0};
        return this.state.diagonal({source: o, target: o});
      });

    // Transition links to their new position.
    existingLinkPaths.merge(newLinkPaths).transition(transition)
      .attr("d", this.state.diagonal);

    // Transition exiting nodes to the parent's new position.
    existingLinkPaths.exit().transition(transition).remove()
      .attr("d", d => {
        const o = {x: root.x, y: root.y};
        return this.state.diagonal({source: o, target: o});
      });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  componentDidMount() {
    console.log("Hit TreeMindMap componentDidMount.");
    this.chart();
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <Grid container alignItems="center" justify="center" spacing={24}>
          <Grid item sm={12}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.outlinedButton}
            >
              Add Sibling Node
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.outlinedButton}
            >
              Add Child Node
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.outlinedButton}
            >
              Rename Node
            </Button>
          </Grid>
          <Grid item sm={12}>
            <svg width="1000" height="1000"
                 ref={ svg => this.svg = svg }
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(TreeMindMapPrev);
