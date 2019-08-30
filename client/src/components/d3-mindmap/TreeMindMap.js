/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/TreeMindMap.js
 * Descr:    D3 mind map.  See examples on https://observablehq.com/@jianan-li/mind-map-with-data-persistence-wip.
 * Created:  2019-06-05
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-08-09
 * Changes:  Changing height and width of mind map to use window inner height and width, minus some corrections.
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import * as d3 from "d3";
import { red, grey } from "@material-ui/core/colors";
import "./tree-styles.scss";
import Grid from "@material-ui/core/Grid/index";
import { getOrgId, getOrgName } from "../../redux";
import Snackbar from "@material-ui/core/Snackbar";
import "./mindmap.scss";
import "antd/dist/antd.css";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  grid: {
    width: 1500,
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  typography: {
    padding: theme.spacing.unit * 2
  },
  main: {
    //stroke: "#05668D",
    //fill: "white",
    strokeWidth: "2px"
  },
  text: {
    fill: "black",
    //fontFamily: "Verdana, Arial, Helvetica, Geneva, sans-serif",
    //fontSize: "10px",
    },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    outline: "none"
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
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    paddingBottom: 200
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
// Use this JSON data to test a new mind map, starting only with root.
// eslint-disable-next-line no-unused-vars
const jsonNew = {
  id: "_ns1nvi0ai",
  name: "Root"
};
const jsonTestData = {
  "id": "_ns1nvi0ai",
  "name": "Root",
  "children": [{
    "id": "_o4r47dq71",
    "name": "Reduce operating costs",
    "note": "Look to reduce operating costs throughout all divisions and locations.  Start with aggregating data.",
    "children": [{
      "id": "_al6om6znz",
      "name": "Reduce inventory",
      "children": [{
        "id": "_46ct4o4oy",
        "name": "Review part models"
      }, {
        "id": "_ea00nojwy",
        "name": "Optimize supply chain"
      }]
    },
      {
        "id": "_z3uk0721f",
        "name": "Operating procedures",
        "note": "Initial review of operating procedures."
      }
    ]
  }, {
    "id": "_uajrljib9",
    "name": "Review supply chain processes"
  },
    {
      "id": "_uguzpgdta",
      "name": "Introduce automation",
      "children": [{
        "id": "_6e1egf02s",
        "name": "Q"
      },
        {
          "id": "_t8ln1vlwa",
          "name": "Review supply chain",
          "children": [{
            "id": "_qzltyy8rn",
            "name": "Optimize data flow"
          }]
        }
      ]
    }
  ]
};
const duration = 100;
const dx = 100;
const dy = 100;
const DEBUG_USE_TEST_DATA = true;
const margin = { top: 40, right: 100, bottom: 40, left: 80 };
const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
const vWidth = 350;
const vHeight = 600;
const vRad = 25;
const noteColor = ['#feff9c', '#7afcff', '#ff7eb9'];
/**
 * @method: guid
 * @desc: Generates unique guid
 **/
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
    s4() + "-" + s4() + s4() + s4();
}

function printNodes(msg, root) {
  // Log where the nodes are.
  console.log(msg);
  root.descendants().forEach((d, i) => {
    console.log("node i: " + i + ", d.depth:" + d.depth + ", data.name: " + d.data.name +
      ", d.x:" + parseFloat(d.x).toFixed(2) + ", d.y: " + parseFloat(d.y).toFixed(2));
  });
};

class TreeMindMap extends React.Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.chart = this.chart.bind(this);
    this.createTreeLayout = this.createTreeLayout.bind(this);
    this.appendChildToSelectedNode = this.appendChildToSelectedNode.bind(this);
    this.appendChild = this.appendChild.bind(this);
    this.addSiblingToSelectedNode = this.addSiblingToSelectedNode.bind(this);
    this.addSibling = this.addSibling.bind(this);
    this.editNode = this.editNode.bind(this);
    this.renameNode = this.renameNode.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
    this.undoDeleteNode = this.undoDeleteNode.bind(this);
    this.getLastDeletedNode = this.getLastDeletedNode.bind(this);
    this.rename = this.rename.bind(this);
    this.newMap = this.newMap.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.deselectNode = this.deselectNode.bind(this);
    this.updateNodeValue = this.updateNodeValue.bind(this);
    this.d3Tree = this.d3Tree.bind(this);
    this.saveJson = this.saveJson.bind(this);
    this.hasChildren = this.hasChildren.bind(this);
    this.findNode = this.findNode.bind(this);
    this.findParentNode = this.findParentNode.bind(this);
    this.findSelectedNodeId = this.findSelectedNodeId.bind(this);
    this.findSelectedNodeName = this.findSelectedNodeName.bind(this);
    this.findSelectedNode = this.findSelectedNode.bind(this);
    this.getNodeById = this.getNodeById.bind(this);
    this.fullTree = this.fullTree.bind(this);
    this.fetchIdea = this.fetchIdea.bind(this);
    this.viewIdea = this.viewIdea.bind(this);
    this.logNode = this.logNode.bind(this);
    this.isUndoDeleteDisabled = this.isUndoDeleteDisabled.bind(this);
    this.isDeleteDisabled = this.isDeleteDisabled.bind(this);
    this.handleKeypressEsc = this.handleKeypressEsc.bind(this);
    this.handleClickOnNode = this.handleClickOnNode.bind(this);
    this.handleClickOnCanvas = this.handleClickOnCanvas.bind(this);
    this.removeSelectedNode = this.removeSelectedNode.bind(this);
    this.handleSubmitIdea = this.handleSubmitIdea.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handlePopoverClick = this.handlePopoverClick.bind(this);
    this.handlePopoverClose = this.handlePopoverClose.bind(this);
    this.createId = this.createId.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.addNote = this.addNote.bind(this);
    this.openNote = this.openNote.bind(this);
    this.closeNote = this.closeNote.bind(this);
    this.getNoteRect = this.getNoteRect.bind(this);
    this.addNoteRects = this.addNoteRects.bind(this);
    this.update = this.update.bind(this);
    this.state = {
      width: window.innerWidth - 500,         // width for the mind map
      height: window.innerHeight - 400,       // height for the mimd map
      svg: d3.select(this.svg),
      orgName: getOrgName(),
      orgId: getOrgId(),
      jsonData: DEBUG_USE_TEST_DATA? jsonTestData : jsonNew,
      isNewMap: false,
      openSnackbar: false,
      message: "",
      d3DataLeft: undefined,
      d3DataRight: undefined,
      tree: d3.tree().nodeSize([dx, dy]).size([500, 600]),
      open: false,
      openPopover: false,
      placement: undefined,
      anchorEl: null,
      setOpen: false,
      modalOpen: false,
      modalTop: 0,
      modalLeft: 0,
      modalVisible: false,
      isEditingIdea: false,
      nodeId: "",
      nodeTitle: "",
      idea: "",
      deletedNodes: [],     // start using an arrary for this.
      deletedNodeId: "",
      deletedNodeName: "",
      deletedNodeParentId: "",
      deleteDisabled: true,
      undoDeleteDisabled: true,
      notesStringArray: []
    };
  }

  addNote = () => {
    let svg = d3.select("svg");
    let root = this.createTreeLayout();

    root.descendants().forEach((d, i) => {
      d.id = d.data.id;
      d.name = d.data.name;
      d._children = d.children;
    });

    const nodes = root.descendants();
    const links = root.links();
    let g = d3.select("svg");
    let vDelay = 250;
    let vDuration = 1000;

    this.openNote();
  };

  // open note for selected ID
  openNote = () => {
    let svg = d3.select("svg");
    let selectedNode = this.findSelectedNode();
    let vDuration = 1000;
    // This changes the note to a yellow square.
    selectedNode.selectAll("rect.main")
      .transition().duration(vDuration)
      .attr("rx", 0).attr("width", vRad * 6).attr("height", vRad * 8)
      .style("fill", function(d) { return d.data.color; })
      .style("stroke", function(d) { return d.data.color; }).style("opacity", 1);

    // Add <text>s and labels
    selectedNode
      .append("foreignObject")
      .attr("x", 20)
      .attr("y", 10)
      .attr("width", vRad * 5)
      .attr("height", vRad * 8)
      .append("xhtml:p")
      .text(d => d.data.note)
      .style("font-family", "Arial")
      .style("stroke", "none")
      .style("font-size", "13px");
  };

  closeNote = (nodeId) => {
    // This minimizes the note.
    let vDuration = 1000;
    let json = this.state.jsonData;
    let node = this.getNodeById(nodeId, json);
    node.selectAll("rect.main")
      .transition().duration(vDuration)
      .attr("rx", 0).attr("width", vRad ).attr("height", vRad )
      .style("fill", function(d) { return d.data.color; })
      .style("stroke", function(d) { return d.data.color; }).style("opacity", 1);

    // Add <text>s and labels
    node
      .append("foreignObject")
      .attr("x", 20)
      .attr("y", 10)
      .attr("width", vRad )
      .attr("height", vRad )
      .append("xhtml:p")
      .text(d => d.data.note)
      .style("font-family", "Arial")
      .style("stroke", "none")
      .style("font-size", "13px");
  };

  getNoteRect = () => {
    let svg = d3.select("svg");
    const nodeContainers = svg.select("#nodes");
    let selectedNode = this.findSelectedNode();
    let vDelay = 250;
    let vDuration = 1000;

  };

  addNoteRects = (nodeContainers) => {
    let g = d3.select("svg");
    let vDelay = 250;
    let vDuration = 1000;
    // Add <g>s
    //let vRects = g.selectAll("g").data(nodes).enter().append("g");
      // .attr("transform", function (d) { return "translate(" + (d.y - vRad) + "," + (d.x - vRad) + ")"; });

    // Draw <rect>s
    nodeContainers.append("rect").attr("class","main").attr("width", 0).attr("height", 0)
      .attr("rx", vRad)
      //.attr("transform", "rotate(5)")
      .each( function(d) { d.data.color = noteColor[0];})
      .style("fill", "black")
      .style("opacity", 1);

    /*
    // This changes the note to a yellow square.
    nodeContainers.selectAll("rect.main")
      .transition().duration(vDuration)
      .attr('rx', 0).attr('width', vRad * 6).attr('height', vRad * 8)
      .style('fill', function(d) { return d.data.color; })
      .style('stroke', function(d) { return d.data.color; }).style('opacity', 1);

    // Add <text>s and labels
    nodeContainers
      .append("foreignObject")
      .attr("x", 20)
      .attr("y", 10)
      .attr("width", vRad * 5)
      .attr("height", vRad * 8)
      .append("xhtml:p")
      .text(d => d.data.note)
      .style("font-family", "Arial")
      .style("stroke", "none")
      .style("font-size", "13px");
     */

  };

  createId = () => {
    return (
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  };

  saveJson = () => {
    console.log("JSON:" + JSON.stringify(this.state.jsonData));
    let postData = {
      orgId: this.state.orgId,
      mapData: this.state.jsonData
    };
    console.log("JSON to post:" + JSON.stringify(postData));

    setTimeout(() => {
      fetch("/api/mindmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      })
        .then(response => {
          if (response.status !== 400) {
            // Success - open the snackbar
            this.setState({
              openSnackbar: true,
              message: "Mind map saved."
            });
          } else {
            // TODO: consider handling a 400 response.
          }
        })
        .catch(err => {
          this.setState({ message: "Error occurred." });
        });
    }, 2000);
  };

  appendChild = () => {
    let svg = d3.select(this.svg);
    this.appendChildToSelectedNode(svg);
  };

  addSibling = () => {
    let svg = d3.select(this.svg);
    this.addSiblingToSelectedNode(svg);
  };

  viewIdea = () => {
    let svg = d3.select(this.svg);
    this.fetchIdea();
    this.handlePopoverClick();
  };

  deleteNode = () => {
    let svg = d3.select(this.svg);
    this.removeSelectedNode(svg);
  };

  getLastDeletedNode = () => {
    let lastDeletedNode = null;
    if (this.state.deletedNodes) {
      let arrayLen = this.state.deletedNodes.length;
      lastDeletedNode = this.state.deletedNodes[arrayLen - 1];
    }
    return lastDeletedNode;
  };

  undoDeleteNode = () => {
    // This is similar to appending a node.  We've saved the deleted node id and its parent to state.
    let svg = d3.select(this.svg);

    // Get the last deleted node.
    let deletedNode = this.getLastDeletedNode();

    let parentNodeId = deletedNode.parentId;
    let jsonData = this.state.jsonData;
    let parent = this.getNodeById(parentNodeId, jsonData);

    // Create the child -- this is the deleted node stored in state.
    if (parent.children) parent.children.push(deletedNode);
    else parent.children = [deletedNode];

    // Pop the deleted node info from our array of deleted nodes in state.
    let deletedNodes = this.state.deletedNodes;
    deletedNodes.pop();

    let undoDeleteDisabled = (deletedNodes.length === 0) ? true : false;

    // Save the JSON back to state.
    this.setState({
      jsonData: jsonData,
      deletedNodes: deletedNodes,
      undoDeleteDisabled: undoDeleteDisabled
    });

    this.update(svg);
  };

  newMap = () => {
    this.setState(
      {
        isNewMap: true
      },
      () => {
        console.log(
          "newMap, updated state this.state.isNewMap = " + this.state.isNewMap
        );
        let svg = d3.select(this.svg);
        this.update(svg);
      }
    );
  };

  rename = () => {
    // Renames a node.
    let svg = d3.select(this.svg);
    let selectedNode = console.log("rename node");
    console.log("idOfSelectedNode: " + this.findSelectedNodeId(svg));
    this.editNode(selectedNode);
  };

  findNode = idOfSelectedNode => {
    // Find the node in the JSON data.
    console.log("idOfSelectedNode: " + idOfSelectedNode);

    let nodeInTree = [this.state.jsonData];
    let nodeFound = false;
    let parentNode = null;

    while (nodeInTree.length !== 0) {
      let allCurrentLevelChildren = [];
      for (let node of nodeInTree) {
        if (node.children) {
          allCurrentLevelChildren = allCurrentLevelChildren.concat(
            node.children
          );
        }
        if (node.id === idOfSelectedNode) {
          nodeFound = true;
          parentNode = node;
        }
      }
      if (nodeFound) break;
      else {
        nodeInTree = allCurrentLevelChildren;
      }
    }

    // TODO: Shouldn't be called parentNode probably.
    if (!parentNode) {
      console.log("findNode, error: parentNode not found");
    }
    return parentNode;
  };

  hasChildren = idOfSelectedNode => {
    // Check if the node has children in the JSON data.
    let nodeInTree = [this.state.jsonData];
    let nodeFound = false;
    let parentNode = null;
    let node = null;

    while (nodeInTree.length !== 0) {
      let allCurrentLevelChildren = [];
      for (node of nodeInTree) {
        if (node.children) {
          allCurrentLevelChildren = allCurrentLevelChildren.concat(
            node.children
          );
        }
        if (node.id === idOfSelectedNode) {
          nodeFound = true;
          parentNode = node;
          break;
        }
      }
      if (nodeFound) break;
      else {
        nodeInTree = allCurrentLevelChildren;
      }
    }

    let hasChildren = false;
    if (nodeFound && node.children) {
      hasChildren = true;
    }
    return hasChildren;
  };

  findParentNode = idOfSelectedNode => {
    // Find the parent of the node in the JSON data.
    console.log("idOfSelectedNode: " + idOfSelectedNode);

    let parentNodes = [this.state.jsonData];
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
            break;
          }
        }
      }
      if (nodeFound) {
        break;
      } else {
        parentNodes = allNextLevelParents;
      }
    }

    if (!parent) {
      console.log("findNode, error: parentNode not found");
    }
    return parent;
  };

  findSelectedNodeId = svg => {
    let idOfSelectedNode = svg
      .selectAll("g.node")
      .filter(".node-selected")
      .attr("id");
    return idOfSelectedNode;
  };

  findSelectedNodeName = () => {
    let svg = d3.select(this.svg);
    let nameOfSelectedNode = svg
      .selectAll("g.node")
      .filter(".node-selected")
      .attr("name");
    return nameOfSelectedNode;
  };

  findSelectedNode = () => {
    let svg = d3.select(this.svg);
    let nodeSelected = svg.selectAll("g.node").filter(".node-selected");
    return nodeSelected;
  };

  getNodeById = (id, node) => {
    // This function works on the JSON data.
    var reduce = [].reduce;
    function runner(result, node) {
      if (result || !node) return result;
      return (
        (node.id === id && node) || //is this the proper node?
        runner(null, node.children) || //process this nodes children
        reduce.call(Object(node), runner, result)
      ); //maybe this is some ArrayLike Structure
    }
    return runner(null, node);
  };

  appendChildToSelectedNode = svg => {
    // This version appends a child to the JSON, not the svg.  7/17/19.
    let idOfSelectedNode = this.findSelectedNodeId(svg);
    this.logNode("appendChildToSelectedNode");
    let json = this.state.jsonData;
    let parent = this.getNodeById(idOfSelectedNode, json);

    // Create the child.
    let child = {
      name: "",
      id: this.createId()
    };


    // TODO: change this to add child to the JSON, or get parent directly from the JSON.
    // Should just be able to change the JSON element.  For instance, change this:
    //
    if (parent.children) parent.children.push(child);
    else parent.children = [child];

    // Save the JSON back to state.
    this.setState({
      jsonData: json
    });

    this.update(svg);
  };

  addSiblingToSelectedNode = svg => {
    let idOfSelectedNode = this.findSelectedNodeId(svg);
    let parent = this.findParentNode(idOfSelectedNode);

    let child = {
      id: this.createId()
    };
    parent.children.push(child);
    this.update(svg);
  };

  /**
   * Create the SVG and attach keystroke events to it.
   * The svg is initialized with height = dx.
   * This will be updated later when the rest of the nodes in the tree are entered.
   * @returns {*}
   */
  chart = () => {
    // 1. append to body, see https://blog.logrocket.com/data-visualization-in-react-using-react-d3-c35835af16d0/
    let svg = d3
      .select(this.svg)
      .attr("width", this.state.width)
      .attr("height", this.state.height)
      .style("font", "14px sans-serif")
      .on("click", this.handleClickOnCanvas);

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
    d3.select("body").on("keydown", function(e) {
      // eslint-disable-next-line no-console
      console.log(`keydown: ${d3.event.keyCode}`);
      // Check to see if a node is being edited
      let nodeIsBeingEdited = gNode.select("g.node-editing").size();

      /*
      if (d3.event.keyCode === 9) {
        console.log("tab - append child to selected node");
        // appendChildToSelectedNode(svg);
      } else if (d3.event.keyCode === 13 && !nodeIsBeingEdited) {
        console.log("enter - add sibling to selected node");
        // addSiblingToSelectedNode(svg);
      } else if (d3.event.keyCode === 8 && !nodeIsBeingEdited) {
        console.log("delete - remove selected node");
        removeSelectedNode(svg);
      } else if (d3.event.keyCode === 27) {
        console.log("esc - deselect node");
        // handleKeypressEsc(svg);
      } */
    });

    return svg.node();
  };

  handleKeypressEsc = svg => {
    // TODO: this isn't getting called.
    svg
      .selectAll("g.node")
      .filter(".node-selected")
      .each(this.deselectNode);
  };

  renameNode = (d, i, nodes) => {
    console.log("renameNode");
    const currentlySelectedNode = d3.selectAll(nodes).filter(".node-selected");

    const clickedNodeIndex = i;
    const clickedNode = nodes[clickedNodeIndex];
    const clickedNodeID = d3.select(clickedNode).attr("name");
    // const otherNodes = d3.selectAll(nodes).filter((d,i) => i!== clickedNodeIndex);

    if (
      currentlySelectedNode.size() > 0 &&
      currentlySelectedNode.attr("name") === clickedNodeID
    ) {
      console.log("renameNode: going into editing mode!");
      d3.select(clickedNode).call(this.editNode);
    }
  };

  getSelectedNodeId = selectedNodeId => {
    this.props.callback(selectedNodeId);
  };

  getSelectedNode = (nodes, i) => {
    // Had to change the implementation of this to use the index instead of using
    // a filter on ".node-selected". Come back and see why that didn't work if there is time.
    /*
    const currentlySelectedNode =
      d3.selectAll(nodes)
        .filter(".node-selected");
     */

    const currentlySelectedNode = d3.select(nodes[i]);
    return currentlySelectedNode;
  };

  handleClickOnNode = (d, i, nodes) => {
    console.log("handleClickOnNode: clicked on a node.");
    let svg = d3.select("svg");
    const currentlySelectedNode = this.getSelectedNode(nodes, i);

    const clickedNodeIndex = i;
    const clickedNode = nodes[clickedNodeIndex];
    const clickedNodeID = d3.select(clickedNode).attr("name");
    const otherNodes = d3
      .selectAll(nodes)
      .filter((d, i) => i !== clickedNodeIndex);

    if (
      currentlySelectedNode.size() > 0 &&
      currentlySelectedNode.attr("name") === clickedNodeID
    ) {
      console.log("going into edit mode!");
      d3.select(clickedNode)
        //.call(this.editNode)
        .call(this.selectNode);
    } else {
      d3.select(clickedNode).call(this.selectNode);

      // If not already selected, mark as selected
      otherNodes.each(this.deselectNode);
    }

    // d.children = d.children ? null : d._children;
    // update(d);

    // Prevent triggering clickOnCanvas handler
    // https://stackoverflow.com/questions/22941796/attaching-onclick-event-to-d3-chart-background
    d3.event.stopPropagation();
  };

  isUndoDeleteDisabled = () => {
    return this.state.undoDeleteDisabled;
  };

  isDeleteDisabled = () => {
    return this.state.deleteDisabled;
  };

  removeSelectedNodeFromData = svg => {
    // Removes selected node from the JSON data, stored in state.
    let selectedNodeId = this.findSelectedNodeId(svg);
    let selectedNodeName = this.findSelectedNodeName();
    let jsonData = [this.state.jsonData];
    let parent = this.findParentNode(selectedNodeId);

    if (parent && parent.children) {
      // This deletes from the JSON.
      parent.children = parent.children.filter(
        child => child.id !== selectedNodeId
      );
      parent.children.length === 0 && delete parent.children;
    }
    console.log("JSON for jsonData now is:" + JSON.stringify(jsonData));
    let deletedNode = {
      id: selectedNodeId,
      name: selectedNodeName,
      parentId: parent.id
    };
    let deletedNodes = this.state.deletedNodes;
    deletedNodes.push(deletedNode);

    this.setState({
      jsonData: jsonData,
      deletedNodes: deletedNodes,   // Array of deleted nodes
      undoDeleteDisabled: false
    });
  };

  removeSelectedNode = svg => {
    let selectedNode = this.findSelectedNode();

    this.removeSelectedNodeFromData(svg);

    // Commenting this after updating state.  May need to add back.
    // Need to delete the child nodes of the selected node, which include the text box and the circle.
    if (selectedNode) {
      let childNodes = selectedNode.selectAll("*");
      // childNodes.exit().remove();
      if (childNodes) {
        childNodes.remove();
      }
      selectedNode.remove();
    }

    /*
    // Find the link and try to remove it separately.
    let linkFound = false;
    let links = d3.hierarchy(this.state.jsonData).links();

    let thisLink = null;

    for (let i=0; i < links.length; i++) {
      let link = links[i];
      if ((link.source.data.id === idOfSelectedNode) || (link.target.data.id === idOfSelectedNode)) {
        linkFound = true;
        thisLink = link;
        if (linkFound) break;
      }
    }

    if (thisLink) {
      thisLink.exit().remove();
      console.log("Link removed.");
    }
    */

    this.update(svg);
  };

  editNode = node => {
    node
      .classed("node-editing", true)
      .select("foreignObject")
      .select("p")
      .style("background-color", "#ddd");
    console.log(`${node.attr("name")} is being edited`);
  };

  selectNode = node => {
    d3.selectAll("g.node")
      .filter(".node-selected")
      .each(this.deselectNode);
    node
      .classed("node-selected", true)
      .select("foreignObject")
      .select("p")
      .attr("contenteditable", "true")
      .style("background-color", "#ddd");
    node
      .classed("node-selected", true)
      .select("circle")
      .style("fill", "green");

    const idOfSelectedNode = node.attr("id");

    this.getSelectedNodeId(idOfSelectedNode);
    console.log(`${node.attr("name")} selected`);

    // Determine whether to disable the delete node button.
    if (this.hasChildren(idOfSelectedNode)) {
      this.setState({
        deleteDisabled: true
      });
    } else {
      this.setState({
        deleteDisabled: false
      });
    }
  };

  logNode = message => {
    let svg = d3.select("svg");
    console.log(message, ": node ID = " + this.findSelectedNodeId(svg) +
        ", name = " + this.findSelectedNodeName());
  };

  deselectNode = (d, i, nodes) => {
    this.logNode("deselectNode");
    let idOfSelectedNode = d3.select(nodes[i]).attr("id");

    // new code
    this.closeNote(idOfSelectedNode);

    let newValue = d3
      .select(nodes[i])
      .select("foreignObject")
      .select("p")
      .html();

    d3.select(nodes[i])
      .select("circle")
      .style("fill", d => (d._children ? "#159" : "#159"));

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
    let nodeInTree = [this.state.jsonData];

    let nodeFound = false;
    let parent = this.findNode(idOfSelectedNode);
    parent.name = newValue;
  };

  handleClickOnCanvas = (d, i, nodes) => {
    console.log("handleClickOnCanvas, nodes: " + nodes[i]);
    d3.select(nodes[i])
      .selectAll("g.node")
      .filter(".node-selected")
      .each(this.deselectNode);
  };

  appendText = nodeContainers => {
    // The "foreignObject" object will display the name text on the node.
    nodeContainers
      .append("foreignObject")
      .attr("x", -80)
      .attr("y", -35)
      .attr("width", 200)
      .attr("height", 40)
      .append("xhtml:p")
      .text(d => {
        // logAppendText(d, true);
        return d.data.name;
      });
  };

  appendCircle = (nodeContainers, direction) => {
    //.attr("fill", d => d._children ? "#555" : "#999");
    let color = "#555";
    nodeContainers
      .append("circle")
      .attr("r", 10)
      .attr("fill", function(d) {
        // this.logAppendCircle(d, true);
        return color;
      });
  };

  createLinks = (g, links) => {
    let link = g
      .selectAll(".link")
      .data(links)
      .enter();

    link
      .append("path")
      .attr("class", "link")
      .attr("d", function(d) {
        return (
          "M" + d.target.y + "," + d.target.x + "C" + (d.target.y + d.source.y) / 2.5 + "," + d.target.x +
          " " + (d.target.y + d.source.y) / 2 + "," + d.source.x + " " + d.source.y + "," + d.source.x);
      });
  };

  createNodes = (g, nodes) => {
    // This should be like line 741 in TreMindMap-629.js
    // const newNodeContainers = existingNodeContainers.enter().append("g")
    // Add the the id and name and attributes here.

    // .enter() is for the new nodes.
    let node = g
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("id", (d, i) => `${d.id}`)
      .attr("name", (d, i) => `${d.data.name}`)
      .attr("class", function(d) {
        return "node" + (d.children ? " node--internal" : " node--leaf");
      })
      .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")";
      });
    return node;
  };

  shiftTree = svg => {
    let width = this.state.width;
    let g = svg.selectAll("g").attr("transform", "translate(" + width / 2 + ", 0)");
    return g;
  };

  fetchIdea = () => {
    let svg = d3.select("svg");
    let selectedNodeId = this.findSelectedNodeId(svg);
    let selectedNodeName = this.findSelectedNodeName();

    if (selectedNodeId !== "") {
      fetch(`/api/ideas-node/${selectedNodeId}`)
        .then(res => res.json())
        .then(idea => {
          if (idea.ideaText) {
            this.setState({
              idea: idea.ideaText,
              nodeTitle: selectedNodeName,
              nodeId: selectedNodeId,
              isEditingIdea: true
            });
          } else {
            this.setState({
              idea: "",
              nodeTitle: selectedNodeName,
              nodeId: selectedNodeId,
              isEditingIdea: false
            });
          }
        });
    }
  };

  createTreeLayout = () => {
    let svg = d3.select("svg");
    let leftTree = this.loadData("left");
    let rightTree = this.loadData("right");

    let d3TreeHeight = this.state.height;
    let d3TreeWidth = (this.state.width - 50) / 2;      // Should be roughly half the SVG width, so divide by 2.

    // Compute the layout.
    // tree.size() sets the available layout size, with x and y values.  Keep in mind we are rotating our
    // tree by 90 degrees, so height is in the x position, and width in the y position.
    // For the left tree, the y value is negative, meaning the tree is reversed, it goes to the left.
    let treeLeft = d3.tree().size([d3TreeHeight, (-1 * d3TreeWidth)]);
    let treeRight = d3.tree().size([d3TreeHeight, d3TreeWidth]);

    // The shift the entire tree by half its width
    let g = svg.select("g").attr("transform", "translate(" + this.state.width / 2 + ",0)");

    // Compute the new tree layouts.
    this.d3Tree(leftTree, "left");
    this.d3Tree(rightTree, "right");

    // Set the origins of each left and right tree to the same x position, which we use as the y position, given
    // we rotate the tree by 90 degrees.
    rightTree.x = d3TreeHeight/2;
    leftTree.x = d3TreeHeight/2;

    // Combine the outputs from D3 tree.
    rightTree.children.forEach((d, i) => {
      leftTree.children.push(d);
    });

    // use leftTree as the root
    let root = leftTree;
    return root;
  };

  // Draw the full bidirectional tree.
  fullTree = () => {
    let svg = d3.select("svg");
    let root = this.createTreeLayout();

    root.descendants().forEach((d, i) => {
      d.id = d.data.id;
      d.name = d.data.name;
      d._children = d.children;
    });

    const nodes = root.descendants();
    const links = root.links();

    // Set both root nodes to be dead center vertically
    nodes[0].x = this.state.height / 2;

    const transition = svg
      .transition()
      .duration(duration)
      .attr("height", this.state.height)
      .tween(
        "resize",
        window.ResizeObserver ? null : () => () => svg.dispatch("toggle")
      );

    // Update the nodes
    const existingNodeContainers = svg
      .select("#nodes")
      .selectAll("g")
      .data(nodes, d => d.id)
      .data(nodes, d => d.name);

    // Enter any new nodes at the parent's previous position.
    // Create new node containers that each contains a circle and a text label
    const newNodeContainers = existingNodeContainers
      .enter()
      .append("g")
      .attr("id", (d, i) => `${d.id}`)
      .attr("name", (d, i) => `${d.data.name}`)
      .attr("class", "node")
      .attr("transform", d => `translate(${root.y0},${root.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);

    newNodeContainers
      .append("circle")
      .attr("r", 10)
      .attr("fill", d => (d._children ? "#159" : "#159"));

    // The "foreignObject" object will display the name text on the node.
    newNodeContainers
      .append("foreignObject")
      .attr("x", -80)
      .attr("y", -35)
      .attr("width", 150)
      .attr("height", 40)
      .append("xhtml:p")
      .text(d => d.data.name)
      .style("font-family", "Arial");

    // #newcode
    this.addNoteRects(newNodeContainers);


    existingNodeContainers
      .merge(newNodeContainers)
      .on("click", this.handleClickOnNode);

    // Transition nodes to their new position.
    // Increase opacity from 0 to 1 during transition
    const nodeUpdate = existingNodeContainers
      .merge(newNodeContainers)
      //.transition(transition)
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    // Reduce opacity from 1 to 0 during transition
    const nodeExit = existingNodeContainers
      .exit()
      .transition(transition)
      .remove()
      .attr("transform", d => `translate(${root.y},${root.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);

    // Update the links…
    const existingLinkPaths = svg
      .select("#links")
      .selectAll("path")
      .data(links, d => d.target.id);

    // newLinkPaths
    let newLinkPaths = existingLinkPaths
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", diagonal);

    let mergedLinks = existingLinkPaths.merge(newLinkPaths);

    // Transition links to their new position.
    mergedLinks
      .transition()
      .duration(duration)
      .attr("transform", "translate(" + this.state.width / 2 + ",0)")
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    existingLinkPaths
      .exit()
      .transition()
      .duration(duration)
      .attr("d", diagonal)
      .remove();

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  };

  d3Tree = (treeData, direction) => {
    let SWITCH_CONST = 1;
    if (direction === "left") {
      SWITCH_CONST = -1;
    }
    // Compute the layout.
    let tree = d3.tree().size([this.state.height, (SWITCH_CONST * (this.state.width - 150)) / 2]);

    return tree(treeData);
  };

  loadData = direction => {
    // Loads JSON data into a D3 tree hierarchy.
    let d3Data = "";
    let jsonData = this.state.jsonData;
    let split_index = Math.round(jsonData.children.length / 2);

    if (direction === "left") {
      // Left data
      d3Data = {
        name: jsonData.name,
        id: jsonData.id,
        children: JSON.parse(
          JSON.stringify(jsonData.children.slice(split_index))
        )
      };
    } else {
      // Right data
      d3Data = {
        name: jsonData.name,
        id: jsonData.id,
        children: JSON.parse(
          JSON.stringify(jsonData.children.slice(0, split_index))
        )
      };
    }

    // d3.hierarchy object is a data structure that represents a hierarchy.
    // It has a number of functions defined on it for retrieving things like
    // ancestor, descendant, and leaf nodes, and for computing the path between nodes.
    let d3HierarchyData = d3.hierarchy(d3Data);
    return d3HierarchyData;
  };

  update = svg => {
    // d3.hierarchy object is a data structure that represents a hierarchy
    // It has a number of functions defined on it for retrieving things like
    // ancestor, descendant, and leaf nodes, and for computing the path between nodes
    this.fullTree();
    this.setState({
      isNewMap: false
    });
  };

  componentDidMount() {
    if (DEBUG_USE_TEST_DATA) {
      this.setState({
        jsonData: jsonTestData
      });
      this.chart();
    } else {
      // Try to fetch data.
      if (this.state.orgId > 0) {
        fetch(`/api/mindmaps-org/${this.state.orgId}`)
          .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
              return response.json().then(map => {
                // process your JSON data further
                if (map[0]) {
                  this.setState({
                    // jsonData: JSON.stringify(map[0].mapData)
                    jsonData: map[0].mapData
                  });
                } else {
                  this.setState({
                    isNewMap: true
                  });
                }
              });
            } else {
              this.setState({
                isNewMap: true
              });
            }
          })
          .then(() => {
            // Then call chart().
            this.chart();
          });
      } else {
        this.setState({
          isNewMap: true
        });
        this.chart();
      }
    }
  }

  // Functions for the snackbar
  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };

  // For post-it notes.  Need to change these.
  onSave () {
    // Make sure to delete the editorState before saving to backend
    const notes = this.state.notes;
    notes.map(note => {
      delete note.editorState;
    })
    // Make service call to save notes
    // Code goes here...
  };

  onChange (notes) {
    this.setState({ // Update the notes state
      notes
    });
  };

  handleIdeaChange = name => event => {
    this.setState({ idea: event.target.value });
  };

  handleSubmitIdea = () => {
    // Save idea.  Selected node ID should already be in state, so will be submitted when we JSON.stringify state,
    // which will be needed for create.
    const orgId = getOrgId();
    let svg = d3.select("svg");
    let selectedNodeId = this.findSelectedNodeId(svg);
    let apiPath = "";
    let successMessage = "";
    let method = "";

    if (selectedNodeId !== "") {
      if (this.state.isEditingIdea) {
        // For edit
        apiPath = "/api/ideas/" + selectedNodeId;
        successMessage = "Idea updated.";
        method = "PUT";
      } else {
        // For create
        apiPath = "/api/ideas/";
        successMessage = "Idea created.";
        method = "POST";
      }
    }

    setTimeout(() => {
      fetch(apiPath, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.state)
      })
        .then(() => {
          this.setState({
            message: successMessage,
            modalVisible: false,
            openSnackbar: true,
            open: false
          });
        })
        .catch(err => {
          console.log(err);
        });
    }, 2000);
  };

  // Modal dialog for the idea functions
  handleModalOpen = () => {
    this.setState({
      modalOpen: true
    });
  };

  handleModalClose = () => {
    this.setState({
      modalOpen: false
    });
  };

  handlePopoverClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
      openPopover: true
    });
  };

  handlePopoverClose = () => {
    this.setState({
      anchorEl: null,
      openPopover: false
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>

        <Grid
          container
          alignItems="center"
          justify="center"
          spacing={24}
          className={classes.root}
        >
          <Grid item sm={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.newMap}
              className={classes.outlinedButton}
            >
              New Mind Map
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.appendChild}
              className={classes.outlinedButton}
            >
              Add Child Node
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.addSibling}
              className={classes.outlinedButton}
            >
              Add Sibling Node
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.addNote}
              className={classes.outlinedButton}
            >
              Add Note
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={this.state.deleteDisabled}
              onClick={this.deleteNode}
              className={classes.outlinedButton}
            >
              Delete Node
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={this.state.undoDeleteDisabled}
              onClick={this.undoDeleteNode}
              className={classes.outlinedButton}
            >
              Undo Delete
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.saveJson}
              className={classes.outlinedButton}
            >
              Save Mind Map
            </Button>
          </Grid>
          <Grid item sm={12}>
            <Typography variant="h6">
              Mind Map for {this.state.orgName}
            </Typography>
          </Grid>
          <Grid item sm={12}>
            <svg width="900" height="600" ref={svg => (this.svg = svg)} />
          </Grid>
        </Grid>
        <Grid item sm={12}>
          <Snackbar
            open={this.state.openSnackbar}
            onClose={this.handleClose}
            TransitionComponent={this.state.Transition}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            message={<span id="message-id">{this.state.message}</span>}
          />
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(TreeMindMap);
