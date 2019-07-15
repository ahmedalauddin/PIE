/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/d3-mindmap/TreeMindMap.js
 * Descr:    D3 mind map.  See examples on https://observablehq.com/@jianan-li/mind-map-with-data-persistence-wip.
 * Created:  2019-06-05
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-06-17
 * Changes:  Moving state into constructor.
 * Editor:   Brad Kaufman
 */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import * as d3 from "d3";
import { red, grey } from "@material-ui/core/colors";
import "./tree-styles.scss";
import Grid from "@material-ui/core/Grid/index";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { getOrgId, getOrgName } from "../../redux";
import Snackbar from "@material-ui/core/Snackbar";
import "./mindmap.scss";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = theme => ({
  grid: {
    width: 1500,
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
  "id": "_ns1nvi0ai",
  "name": "Root"
  };
const treeData = {
  "id": "_ns1nvi0ai",
  "name": "Increase plant availability",
  "children": [{
    "id": "_o4r47dq71",
    "name": "Reduce operating costs",
    "children": [{
      "id": "_al6om6znz",
      "name": "Reduce inventory",
      "children": [{"id": "_46ct4o4oy", "name": "Increase parts availability"}, {
        "id": "_ea00nojwy",
        "name": "Optimize supply chain"
      }]
    }, {
      "id": "_z3uk0721f",
      "name": "Operating procedures",
      "children": [{"id": "_je49rrvdq", "name": "TBD"}, {
        "id": "_riy5iihy9",
        "name": "yellow"
      }, {"id": "_sy8zlb7vz", "name": "blue"}]
    }]
  }, {"id": "_uajrljib9", "name": "Review supply chain processes"}, {
    "id": "_uguzpgdta",
    "name": "Introduce automation",
    "children": [{
      "id": "_t8ln1vlwa",
      "name": "white",
      "children": [
        {"id": "_qzltyy8rn", "name": "green"},
        {"id": "_92xtmt66p", "name": "maroon"}
      ]
    }]
  }]
};
const duration = 1000;
const dx = 200;   // what is dx?
const dy = 125;
const width = 1000;
const height = 1000;
const DEBUG = true;
//const renderLink = d3.linkVertical().x(d => d.x).y(d => d.y);
const Node = d3.hierarchy.prototype.constructor;
const margin = ({top: 40, right: 120, bottom: 40, left: 80});
// See https://bl.ocks.org/mbostock/3184089
const renderLink = d3.linkHorizontal().x(d => d.x).y(d => d.y);
const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

class TreeMindMap extends React.Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.chart = this.chart.bind(this);
    this.appendChildToSelectedNode = this.appendChildToSelectedNode.bind(this);
    this.appendChild = this.appendChild.bind(this);
    this.addSiblingToSelectedNode = this.addSiblingToSelectedNode.bind(this);
    this.addSibling = this.addSibling.bind(this);
    this.editNode = this.editNode.bind(this);
    this.renameNode = this.renameNode.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
    this.rename = this.rename.bind(this);
    this.newMap = this.newMap.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.deselectNode = this.deselectNode.bind(this);
    this.updateNodeValue = this.updateNodeValue.bind(this);
    this.saveJson = this.saveJson.bind(this);
    this.findNode = this.findNode.bind(this);
    this.findParentNode = this.findParentNode.bind(this);
    this.findSelectedNodeId = this.findSelectedNodeId.bind(this);
    this.findSelectedNode = this.findSelectedNode.bind(this);
    this.logCreateNode = this.logCreateNode.bind(this);
    this.logAppendPaths = this.logAppendPaths.bind(this);
    this.logAppendText = this.logAppendText.bind(this);
    this.logAppendCircle = this.logAppendCircle.bind(this);
    this.generateLinkPath = this.generateLinkPath.bind(this);
    this.handleKeypressEsc = this.handleKeypressEsc.bind(this);
    this.handleClickOnNode = this.handleClickOnNode.bind(this);
    this.handleClickOnCanvas = this.handleClickOnCanvas.bind(this);
    this.removeSelectedNode = this.removeSelectedNode.bind(this);
    this.handleSubmitIdea = this.handleSubmitIdea.bind(this);
    this.createId = this.createId.bind(this);
    this.state = {
      width: 1000,
      height: 1000,
      svg: d3.select(this.svg),
      orgName: getOrgName(),
      orgId: getOrgId(),
      //jsonData: "{\"id\": \"_ns1nvi0ai\", \"name\": \"Increase plant availability\", \"children\": [{\"id\": \"_o4r47dq71\", \"name\": \"Reduce operating costs\", \"children\": [{\"id\": \"_al6om6znz\", \"name\": \"Reduce inventory\", \"children\": [{\"id\": \"_46ct4o4oy\", \"name\": \"Increase parts availability\"}, {\"id\": \"_ea00nojwy\", \"name\": \"Optimize supply chain\"}]}, {\"id\": \"_z3uk0721f\", \"name\": \"Operating procedures\", \"children\": [{\"id\": \"_je49rrvdq\", \"name\": \"TBD\"}, {\"id\": \"_riy5iihy9\", \"name\": \"yellow\"}, {\"id\": \"_sy8zlb7vz\", \"name\": \"blue\"}]}]}, {\"id\": \"_uajrljib9\", \"name\": \"Review supply chain processes\"}, {\"id\": \"_uguzpgdta\", \"name\": \"Introduce automation\", \"children\": [{\"id\": \"_t8ln1vlwa\", \"name\": \"white\", \"children\": [{\"id\": \"_qzltyy8rn\", \"name\": \"green\"}, {\"id\": \"_92xtmt66p\", \"name\": \"maroon\"}]}]}]}",
      jsonData: treeData,
      isNewMap: false,
      openSnackbar: false,
      message: "",
      d3DataLeft: undefined,
      d3DataRight: undefined,
      tree: d3.tree().nodeSize([dx, dy]).size([800, 600]),
      open: false,
      setOpen: false,
      idea: ""
    };
    console.log("End TreeMindMap constructor.");
  }

  createId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  saveJson = () => {
    console.log("JSON:" + JSON.stringify(this.state.jsonData));
    let postData = {
      orgId: this.state.orgId,
      mapData: this.state.jsonData
    }
    console.log("JSON to post:" + JSON.stringify(postData));

    setTimeout(() => {
      fetch("/api/mindmaps", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(postData)
      })
        .then((response) => {
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

  deleteNode = () => {
    let svg = d3.select(this.svg);
    this.removeSelectedNode(svg);
  }

  newMap = () => {
    this.setState({
      isNewMap: true
    }, () => {
      console.log("newMap, updated state this.state.isNewMap = " + this.state.isNewMap);
      let svg = d3.select(this.svg);
      this.update(svg);
    });
  };

  rename = () => {
    // Renames a node.
    let svg = d3.select(this.svg);
    let selectedNode =
    console.log("rename node");
    console.log("idOfSelectedNode: " + this.findSelectedNodeId(svg));
    this.editNode(selectedNode);
  };

  findNode = (idOfSelectedNode) => {
    // Find the node in the JSON data.
    console.log("idOfSelectedNode: " + idOfSelectedNode);

    let nodeInTree = [this.state.jsonData];
    let nodeFound = false;
    let parentNode = null;

    while (nodeInTree.length !== 0) {
      let allCurrentLevelChildren = [];
      for (let node of nodeInTree) {
        if (node.children) {
          allCurrentLevelChildren = allCurrentLevelChildren.concat(node.children);
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

  findParentNode = (idOfSelectedNode) => {
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
          }
        }
      }
      if (nodeFound) break;
      else {
        parentNodes = allNextLevelParents;
      }
    }

    if (!parent) {
      console.log("findNode, error: parentNode not found");
    }
    return parent;
  };

  findSelectedNodeId = (svg) => {
    let idOfSelectedNode = svg
      .selectAll("g.node")
      .filter(".node-selected")
      .attr("id");
    return idOfSelectedNode;
  };

  findSelectedNode = (svg) => {
    let nodeSelected = svg
      .selectAll("g.node")
      .filter(".node-selected")
    return nodeSelected;
  };

  appendChildToSelectedNode = (svg) => {
    console.log("appendChildToSelectedNode");
    let idOfSelectedNode = this.findSelectedNodeId(svg);
    let parent = this.findNode(idOfSelectedNode);

    // Create the child.
    let child = {
      name: "",
      id: this.createId()
    };

    if (parent.children) parent.children.push(child);
    else parent.children = [child];

    this.update(svg);
  };

  addSiblingToSelectedNode = (svg) => {
    let idOfSelectedNode = this.findSelectedNodeId(svg);
    let parent = this.findParentNode(idOfSelectedNode);

    let child = {
      id: this.createId()
    };
    parent.push(child);
    this.update(svg);
  };

  chart = () => {
    // Create the SVG and attach keystroke events to it.
    // The svg is initialized with height = dx.
    // This will be updated later when the rest of the nodes in the tree are entered.

    // const svg = d3.create("svg");
    // append to body, see https://blog.logrocket.com/data-visualization-in-react-using-react-d3-c35835af16d0/
    let svg = d3.select(this.svg)
      .attr("width", width)
      .attr("height", height)
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
    /*
    d3.select("body")
      .on("keydown", function(e) {
        // eslint-disable-next-line no-console
        console.log(`keydown: ${d3.event.keyCode}`);
        // Check to see if a node is being edited
        let nodeIsBeingEdited = gNode.select("g.node-editing").size();

        if (d3.event.keyCode === 9) {
          console.log("tab - append child to selected node");
          appendChildToSelectedNode(svg);
        } else if(d3.event.keyCode === 13 && !nodeIsBeingEdited) {
          console.log("enter - add sibling to selected node");
          addSiblingToSelectedNode(svg);
        } else if(d3.event.keyCode === 8 && !nodeIsBeingEdited) {
          console.log("delete - remove selected node");
          removeSelectedNode(svg);
        } else if(d3.event.keyCode === 27) {
          console.log("esc - deselect node");
          handleKeypressEsc(svg);
        }
      });
     */

    return svg.node();
  };

  handleKeypressEsc = (svg) => {
    svg
      .selectAll("g.node")
      .filter(".node-selected")
      .each(this.deselectNode);
  };

  renameNode = (d,i,nodes) => {
    console.log("renameNode");
    const currentlySelectedNode =
      d3.selectAll(nodes)
        .filter(".node-selected");

    const clickedNodeIndex = i;
    const clickedNode = nodes[clickedNodeIndex];
    const clickedNodeID = d3.select(clickedNode).attr("name");
    // const otherNodes = d3.selectAll(nodes).filter((d,i) => i!== clickedNodeIndex);

    if (currentlySelectedNode.size() > 0 && currentlySelectedNode.attr("name") === clickedNodeID) {
      console.log("renameNode: going into editing mode!");
      d3.select(clickedNode).call(this.editNode);
    }
  };

  getSelectedNodeId = (selectedNodeId) => {
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
    const currentlySelectedNode =
      d3.select(nodes[i]);
    return currentlySelectedNode;
  };

  handleClickOnNode = (d,i,nodes) => {
    console.log("handleClickOnNode: clicked on a node.");
    const currentlySelectedNode = this.getSelectedNode(nodes, i);

    const clickedNodeIndex = i;
    const clickedNode = nodes[clickedNodeIndex];
    const clickedNodeID = d3.select(clickedNode).attr("name");
    const otherNodes = d3.selectAll(nodes).filter((d,i) => i!== clickedNodeIndex);

    if (currentlySelectedNode.size() > 0 && currentlySelectedNode.attr("name") === clickedNodeID) {
      console.log("going into editing mode!");
      d3.select(clickedNode)
        //.call(this.editNode)
        .call(this.selectNode);
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

  removeSelectedNodeNew = (svg) => {
    // updated version to remove nodes.  See https://bl.ocks.org/cmgiven/32d4c53f19aea6e528faf10bfe4f3da9 on the
    // approach to use enter() and exit().
    this.removeFromData(svg);
    let update = svg.selectAll("circle")
      .data(this.state.jsonData, function (d) { return d; });
    let enter = update.enter()
      .append("circle");
    let exit = update.exit();
    update.style("fill", "green");
    exit.style("fill", "red").remove();

    console.log("elements removed");
  };

  removeSelectedNodeFromData = (svg) => {
    // Removes selected node from the JSON data, stored in state.
    let idOfSelectedNode = this.findSelectedNodeId(svg);
    let jsonData = [this.state.jsonData];
    let parent =this.findParentNode(idOfSelectedNode);

    if (parent && parent.children) {
      // This deletes from the JSON.
      parent.children = parent.children.filter(child => child.id !== idOfSelectedNode);
      parent.children.length === 0 && delete parent.children;
    }
    console.log("JSON for jsonData now is:" + JSON.stringify(jsonData));
    this.setState({
      jsonData: jsonData
    });
  };

  removeSelectedNode = (svg) => {
    let selectedNode = this.findSelectedNode(svg);

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
    };

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
      .style("background-color", "#ddd");
    node
      .classed("node-selected", true)
      .select("circle")
      .style("fill", "green");

    const idOfSelectedNode = node.attr("id");

    this.getSelectedNodeId(idOfSelectedNode);
    console.log(`${node.attr("name")} selected`);
  };

  deselectNode = (d,i,nodes) => {
    console.log("deselectNode called.");
    let idOfSelectedNode =
      d3.select(nodes[i])
        .attr("id");

    let newValue =
      d3.select(nodes[i])
        .select("foreignObject")
        .select("p")
        .html();

    d3.select(nodes[i])
        .select("circle")
        .style("fill", d => d._children ? "#555" : "#999");

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

  handleClickOnCanvas = (d,i,nodes) => {
    /*
    let { d3 } = this.state;
    console.log("handleClickOnCanvas, nodes: " + nodes[i]);
    d3.select(nodes[i])
      .selectAll('g.node')
      .filter(".node-selected")
      .each(this.deselectNode); */
  };

  appendText = (nodeContainers) => {
    // The "foreignObject" object will display the name text on the node.
    nodeContainers.append("foreignObject")
      .attr("x", -80)
      .attr("y", -35)
      .attr("width", 200)
      .attr("height", 40)
      .append("xhtml:p")
      .text(d => {
        // this.logAppendText(d, true);
        return d.data.name;
      });
  };

  appendCircle = (nodeContainers, direction) => {
    //.attr("fill", d => d._children ? "#555" : "#999");
    // let color = "#900";
    let color = "#555";
    nodeContainers.append("circle")
      .attr("r", 10)
      .attr("fill", function (d) {
        // this.logAppendCircle(d, true);
        return color;
      });
  };

  createLinks = (g, links) => {
    let link = g.selectAll(".link")
      .data(links)
      .enter();

    link.append("path")
      .attr("class", "link")
      .attr("d", function (d) {
        return "M" + d.target.y + "," + d.target.x + "C" + (d.target.y + d.source.y) / 2.5 + "," + d.target.x + " "
          + (d.target.y + d.source.y) / 2 + "," + d.source.x + " " + d.source.y + "," + d.source.x;
      });
  };

  logAppendCircle = (d, ifLogging) => {
    if (ifLogging) {
      console.log("Append circle " + d.name +
        " , at (" + parseFloat(d.x).toFixed(2)
        + ", " + parseFloat(d.y).toFixed(2) + ")");
    }
  };

  logAppendText = (d, ifLogging) => {
    if (ifLogging) {
      console.log("Append text " + d.name +
        " , at (" + parseFloat(d.x).toFixed(2)
        + ", " + parseFloat(d.y).toFixed(2) + ")");
    }
  };

  logCreateNode = (d, ifLogging) => {
    if (ifLogging) {
      console.log("Creating node " + d.name +
        " , translating to (" + parseFloat(d.y).toFixed(2) +
        ", " + parseFloat(d.x).toFixed(2) + ")");
    }
  };

  logAppendPaths = (d, ifLogging) => {
    if (ifLogging) {
      console.log("Appending D3 link from " + d.source.data.name +
        " at (" + parseFloat(d.source.x).toFixed(2)
        + ", " + parseFloat(d.source.y).toFixed(2) + ") to " +
        d.target.data.name +
        " at (" + parseFloat(d.target.x).toFixed(2) +
        ", " + parseFloat(d.target.y).toFixed(2) + ")");
    }
  };

  createNodes = (g, nodes) => {
    // This should be like line 741 in TreMindMap-629.js
    // const newNodeContainers = existingNodeContainers.enter().append("g")
    // Add the the id and name and attributes here.

    // .enter() is for the new nodes.
    let node = g.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("id", (d, i) => `${d.id}`)
      .attr("name", (d, i) => `${d.data.name}`)
      .attr("class", function (d) {
        return "node" + (d.children ? " node--internal" : " node--leaf");
      })
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });
    return node;
  };

  shiftTree = (svg) => {
    let g = svg.selectAll("g").attr("transform", "translate(" + width / 2 + ",0)");
    return g;
  };

  drawTreev2 = (root, direction) => {
    let svg = d3.select("svg");
    let i = 0;
    let SWITCH_CONST = 1;
    if (direction === "left") {
      SWITCH_CONST = -1;
    }
    // Compute the layout.
    let tree = d3.tree()
      .size([height, SWITCH_CONST * (width - 150) / 2]);


    // Shift the entire tree by half it's width
    var g = svg.append("g").attr("transform", "translate(" + width / 2 + ",0)");
    tree(root);
    let nodes = root.descendants();
    var links = root.links();
    // Set both root nodes to be dead center vertically
    nodes[0].x = height / 2;

    nodes.forEach((d, i) => {
      d.id = d.data.id;
      d.name = d.data.name;
      d._children = d.children;
    });

    // Create the link lines.
    var link = g.selectAll(".link")
      .data(links)
      .enter();

    link.append("path")
      .attr("class", "link")
      .attr("d", function(d) {
        return "M" + d.target.y + "," + d.target.x + "C" + (d.target.y + d.source.y) / 2.5 + "," + d.target.x + " " +
          (d.target.y + d.source.y) / 2 + "," + d.source.x + " " + d.source.y + "," + d.source.x;
      });

    // Create the node circles.
    var node = g.selectAll(".node")
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

    node.append("circle")
      .attr("r", function(d, i) {
        return 10;
      });

    // Update the nodes
    node.on("click", this.handleClickOnNode);


  };

  generateLinkPath = (source, target) => {
    let path = d3.path();
    path.moveTo(target.y, target.x);
    path.bezierCurveTo((target.y+source.y)/2, target.x,
      (target.y+source.y)/2, source.x, source.y, source.x);
    return path.toString();
  };

  drawTree = (root, direction) => {
    let svg = d3.select("svg");
    let i = 0;
    let SWITCH_CONST = 1;
    if (direction === "left") {
      SWITCH_CONST = -1;
    }
    // Compute the layout.
    let tree = d3.tree()
      .size([height, SWITCH_CONST * (width - 150) / 2]);

    // Shift the entire tree by half it's width
    let g = svg.select("g").attr("transform", "translate(" + width / 2 + ",0)");

    root.descendants().forEach((d, i) => {
      // console.log(d)
      // console.log(i)
      d.id = d.data.id;
      d.name = d.data.name;
      d._children = d.children;
    });

    const nodes = root.descendants();
    const nodes1 = root.descendants().slice(1);

    // Compute the new tree layout.
    tree(root);

    // Set both root nodes to be dead center vertically
    nodes[0].x = height / 2;

    const transition = svg
      .transition()
      .duration(duration)
      .attr("height", height)
      .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes
    const existingNodeContainers = svg.select("#nodes")
      .selectAll("g")
      .data(nodes, d => d.id)
      .data(nodes, d => d.name);

    // Enter any new nodes at the parent's previous position.
    // Create new node containers that each contains a circle and a text label
    const newNodeContainers = existingNodeContainers.enter().append("g")
      .attr("id", (d, i) => `${d.id}`)
      .attr("name", (d, i) => `${d.data.name}`)
      .attr("class", "node")
      .attr("transform", d => `translate(${root.y0},${root.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);

    newNodeContainers.append("circle")
      .attr("r", 10)
      .attr("fill", d => d._children ? "#555" : "#999");

    // The "foreignObject" object will display the name text on the node.
    newNodeContainers.append("foreignObject")
      .attr("x", -80)
      .attr("y", -35)
      .attr("width", 150)
      .attr("height", 40)
      .append("xhtml:p")
      .text(d => d.data.name);

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
    let link = svg.selectAll("path.link")
      .data(nodes1, d => {
        return d.id || (d.id = ++i);
      })

    link.enter().insert("path", "g")
      .attr("class", "link")
      .merge(link)
      .transition().duration(duration)
      .attr("d", d => {
        return this.generateLinkPath(d, d.parent);
      });

    link.exit().remove();

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  drawTreev3 = (root, direction) => {

    let svg = d3.select("svg");
    let i = 0;
    let SWITCH_CONST = 1;
    if (direction === "left") {
      SWITCH_CONST = -1;
    }
    // Compute the layout.
    let tree = d3.tree()
      .size([height, SWITCH_CONST * (width - 150) / 2]);

    // Shift the entire tree by half it's width
    let g = svg.select("g").attr("transform", "translate(" + width / 2 + ",0)");


    root.descendants().forEach((d, i) => {
      // console.log(d)
      // console.log(i)
      d.id = d.data.id;
      d.name = d.data.name;
      d._children = d.children;
    });

    const nodes = root.descendants();
    const links = root.links();


    // Compute the new tree layout.
    tree(root);

    // Set both root nodes to be dead center vertically
    nodes[0].x = height / 2;

    const transition = svg
      .transition()
      .duration(duration)
      .attr("height", height)
      .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes
    const existingNodeContainers = svg.select("#nodes")
      .selectAll("g")
      .data(nodes, d => d.id)
      .data(nodes, d => d.name);

    // Enter any new nodes at the parent's previous position.
    // Create new node containers that each contains a circle and a text label
    const newNodeContainers = existingNodeContainers.enter().append("g")
      .attr("id", (d, i) => `${d.id}`)
      .attr("name", (d, i) => `${d.data.name}`)
      .attr("class", "node")
      .attr("transform", d => `translate(${root.y0},${root.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);

    newNodeContainers.append("circle")
      .attr("r", 10)
      .attr("fill", d => d._children ? "#555" : "#999");

    // The "foreignObject" object will display the name text on the node.
    newNodeContainers.append("foreignObject")
      .attr("x", -80)
      .attr("y", -35)
      .attr("width", 150)
      .attr("height", 40)
      .append("xhtml:p")
      .text(d => d.data.name);

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
    // const existingLinkPaths1 = svg.select("#links").selectAll("path").data(links, d => d.target.id);
    const existingLinkPaths = svg.select("#links")
      .selectAll("path")
      .data(links);


    // Enter any new links at the parent's previous position.
    /*
    const newLinkPaths1 = existingLinkPaths.enter().append("path")
      .attr("d", d => {
        const o = {x: root.x0, y: root.y0};
        return diagonal({source: o, target: o});
      });
    */

    const newLinkPaths = existingLinkPaths
      .data(links)
      .enter()
      .append("path");


    // Transition links to their new position.
    existingLinkPaths.merge(newLinkPaths).transition(transition)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    existingLinkPaths.exit().transition(transition).remove()
      .attr("d", d => {
        const o = {x: root.x, y: root.y};
        return diagonal({source: o, target: o});
      });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  drawTreev1 = (root, direction) => {
    // eslint-disable-next-line no-unused-vars
    const duration = 2000;
    let i = 0;
    let SWITCH_CONST = 1;
    if (direction === "left") {
      SWITCH_CONST = -1;
    }

    let svg = d3.select("svg");

    // Shift the entire tree by half it's width
    let g = svg.append("g").attr("transform", "translate(" + width / 2 + ",0)");

    let tree = d3.tree()
      .size([height, SWITCH_CONST * (width - 150) / 2]);

    tree(root);

    const transition = svg
      .transition()
      .duration(duration);

    const nodes = root.descendants();
    const links = root.links();

    // todo - maybe remove this
    nodes.forEach((d, i) => {
      console.log(d)
      console.log(i)
      d.id = d.data.id;
      d.name = d.data.name;
      d._children = d.children;
    });
    // Set both root nodes to be dead center vertically
    nodes[0].x = height / 2;

    // Update the nodes…
    // Just added, 7/12
    var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Create links
    let link = this.createLinks(g, links);

    // Create nodes
    node = this.createNodes(g, nodes);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .remove();

    // Append circle
    this.appendCircle(node, direction);

    // Append text
    this.appendText(node);

    // Update the nodes
    node.on("click", this.handleClickOnNode);
  };

  printNodes = (msg, root) => {
    // Log where the nodes are.
    console.log(msg);
    root.descendants().forEach((d, i) => {
      console.log("node i: " + i + ", d.depth:" + d.depth + ", data.name: " +
        d.data.name + ", d.x:" + parseFloat(d.x).toFixed(2) + ", d.y: " + parseFloat(d.y).toFixed(2));
    });
  };

  loadData = (direction) => {
    // Loads JSON data into a D3 tree hierarchy.
    let d3Data = "";
    let jsonData = this.state.jsonData;
    let split_index = Math.round(jsonData.children.length / 2);

    if (direction === "left") {
      // Left data
      d3Data = {
        name: jsonData.name,
        children: JSON.parse(JSON.stringify(jsonData.children.slice(split_index)))
      };
    } else {
      // Right data
      d3Data = {
        name: jsonData.name,
        children: JSON.parse(JSON.stringify(jsonData.children.slice(0, split_index)))
      };
    }

    /***********
     * TODO: somehow have to save both trees into state data.
     */

    let d3HierarchyData = d3.hierarchy(d3Data);
    return d3HierarchyData;
    // Create d3 hierarchies
    /*
    this.setState({
      d3DataRight: d3.hierarchy(dataRight),
      d3DataLeft: d3.hierarchy(dataLeft)
    });
    console.log("setState for left and right trees.");
     */
  };

  update = (svg) => {
    // d3.hierarchy object is a data structure that represents a hierarchy
    // It has a number of functions defined on it for retrieving things like
    // ancestor, descendant, and leaf nodes, and for computing the path between nodes
    let leftTree = this.loadData("left");
    let rightTree = this.loadData("right");

    // this.drawTree(leftTree, "left");
    this.drawTree(rightTree, "right");

    // TODO - may need to split the JSON into right and left too.

    this.setState({
      jsonData: treeData,
      isNewMap: false
    });
  };

  componentDidMount() {
    // DEBUG
    if (DEBUG) {
      this.setState({
        // jsonData: JSON.stringify(map[0].mapData)
        jsonData: treeData
      });
    }
    else {
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
      }
    }

    this.chart();

  }

  // Functions for the snackbar
  handleClose = () => {
    this.setState({ openSnackbar: false });
  };

  handleClick = Transition => () => {
    this.setState({ openSnackbar: true, Transition });
  };

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      open: false
    });
  };

  handleIdeaChange = name => event => {
    this.setState({ idea: event.target.value });
  };


  handleSubmitIdea = (event) => {
    event.preventDefault();
    // Save idea
    const orgId = getOrgId();
    const ideaId = 0;   // may need this later for editing ideas.
    let apiPath = "";
    let successMessage = "";
    let method = "";

    if (ideaId > 0) {
      // For edit
      apiPath = "/api/ideas/" + orgId;
      successMessage = "Idea updated."
      method = "PUT";
    } else {
      // For create
      apiPath = "/api/ideas/";
      successMessage = "Idea created."
      method = "POST";
    }

    setTimeout(() => {
      fetch(apiPath, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.state)
      })
        .then(() => {
          this.setState({
            message: successMessage,
            openSnackbar: true,
            open: false
          });
        })
        .catch(err => {
          console.log(err);
        });
    }, 2000);
  };


  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Grid container alignItems="center" justify="center" spacing={24} className={classes.root}>
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
              onClick={this.handleClickOpen}
              className={classes.outlinedButton}
            >
              Add Note
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.deleteNode}
              className={classes.outlinedButton}
            >
              Delete Node
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
            <svg width="1200" height="1200" ref={ svg => this.svg = svg }
            />
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
        <Dialog open={this.state.open} onClose={this.handleDialogClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Capture idea</DialogTitle>
          <DialogContent>
            <TextField
              id="idea"
              multiline
              autofocus
              rowsMax="6"
              value={this.state.idea}
              onChange={this.handleIdeaChange("idea")}
              className={classes.textFieldWide}
              fullWidth
              margin="dense"
              InputLabelProps={{
                shrink: true
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmitIdea} color="primary">
              Save Idea
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(TreeMindMap);
