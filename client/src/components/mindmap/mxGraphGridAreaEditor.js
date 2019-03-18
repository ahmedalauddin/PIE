/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/components/mindmap/mxGraphGridAreaEditor.js
 * Created:  2019-03-06 16:32:33
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-17 17:59:33
 * Editor:   Darrin Tisdale
 */

import React, { Component } from "react";
import ReactDOM from "react-dom";
import uuid from "uuid/v4";
import CreateTaskNode from "./CreateTaskNode";
import JsonCodec from "./JsonCodec";
import mxCellAttributeChange from "./mxCellAttributeChange";
import { MindMapToolbarButtons } from "./MindMapToolbarButtons";
import "../../stylesheets/mxgraph.css";
import {
  mxGraph,
  //mxParallelEdgeLayout,
  mxConstants,
  mxEdgeStyle,
  //mxLayoutManager,
  mxGraphHandler,
  mxGuide,
  mxEdgeHandler,
  //mxCell,
  //mxGeometry,
  mxRubberband,
  mxDragSource,
  mxKeyHandler,
  //mxCodec,
  mxClient,
  mxConnectionHandler,
  mxUtils,
  //mxToolbar,
  mxEvent,
  mxImage,
  mxConstraintHandler,
  //mxFastOrganicLayout,
  mxUndoManager,
  //mxHierarchicalLayout,
  mxConnectionConstraint,
  mxCellState,
  mxPoint,
  //mxGraphModel,
  mxPerimeter,
  mxCompactTreeLayout,
  mxCellOverlay
} from "mxgraph-js";

/**
 * React-based wrapper foer the mxgraph JS library
 * tailored for ValueInfinity
 *
 * @export
 * @class mxGraphGridAreaEditor
 * @extends {Component}
 */
export default class mxGraphGridAreaEditor extends Component {
  /**
   * Creates an instance of mxGraphGridAreaEditor.
   * @param {*} props
   * @memberof mxGraphGridAreaEditor
   */
  constructor(props) {
    super(props);
    this.state = {
      graph: {},
      layout: {},
      undo: { manager: {}, listener: {} },
      json: "",
      dragElt: null,
      createVisible: false,
      currentNode: null,
      currentTask: "",
      callbacks: {}
    };

    // bind the functions to this instance
    this.LoadGraph = this.LoadGraph.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleZoomIn = this.handleZoomIn.bind(this);
    this.handleZoomOut = this.handleZoomOut.bind(this);
    this.handleZoomRestore = this.handleZoomRestore.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleRedo = this.handleRedo.bind(this);
    this.handleDumpJSON = this.handleDumpJSON.bind(this);

    // create the callbacks state variable
    this.callbacks = {
      handleSave: this.handleSave,
      handleZoomIn: this.handleZoomIn,
      handleZoomOut: this.handleZoomOut,
      handleZoomRestore: this.handleZoomRestore,
      handleUndo: this.handleUndo,
      handleRedo: this.handleRedo,
      handleDumpJSON: this.handleDumpJSON
    };
  }

  /**
   * after mounting, perform this function
   *
   * @memberof mxGraphGridAreaEditor
   */
  componentDidMount() {
    // load the graph, now that it's set up
    this.LoadGraph();
  }

  /**
   * taking in appropriate JSON data,
   * render it to the graph
   *
   * @memberof mxGraphGridAreaEditor
   */
  renderJSON = (dataModel, graph) => {
    const jsonEncoder = new JsonCodec();
    let vertices = {};
    const parent = graph.getDefaultParent();

    // create update transaction
    graph.getModel().beginUpdate();

    // catch any exceptions, so that we can finish
    // the transaction if required
    try {
      // is a dataModel present
      if (dataModel) {
        // for each element on the dataModel's graph
        dataModel.graph.map(node => {
          // if there's a node, check that it has a value
          if (node.value) {
            // is the value equal to "object"?
            if (typeof node.value === "object") {
              // create the xml representation of the node
              const xmlNode = jsonEncoder.encode(node.value);

              // add it to the array
              vertices[node.id] = graph.insertVertex(
                parent,
                null,
                xmlNode,
                node.geometry.x,
                node.geometry.y,
                node.geometry.width,
                node.geometry.height,
                node.style
              );
              // is the node value equal to "edge"?
            } else if (node.value === "Edge") {
              // insert an edge into the graph
              graph.insertEdge(
                parent,
                null,
                "Edge",
                vertices[node.source],
                vertices[node.target],
                node.style
              );
            }
          }
        });
      }
    } finally {
      // finish the rendition of the graph, even if there
      // a failure
      graph.getModel().endUpdate();
    }
  };

  /**
   * extract the json representation of the graph
   *
   * @memberof mxGraphGridAreaEditor
   */
  getJsonModel = graph => {
    const encoder = new JsonCodec();
    const jsonModel = encoder.decode(graph.getModel());
    return {
      graph: jsonModel
    };
  };

  /**
   * Utility function to stringify JSON without
   * containing circular references
   *
   * @memberof mxGraphGridAreaEditor
   */
  stringifyWithoutCircular = json => {
    return JSON.stringify(
      json,
      (key, value) => {
        if (
          (key === "parent" || key === "source" || key === "target") &&
          value !== null
        ) {
          return value.id;
        } else if (key === "value" && value !== null && value.localName) {
          let results = {};
          Object.keys(value.attributes).forEach(attrKey => {
            const attribute = value.attributes[attrKey];
            results[attribute.nodeName] = attribute.nodeValue;
          });
          return results;
        }
        return value;
      },
      2
    );
  };

  /**
   * add overlays to nodes
   *
   * @memberof mxGraphGridAreaEditor
   */
  addOverlays = (graph, cell) => {
    var overlay = new mxCellOverlay(
      new mxImage("../../images/add.png", 16, 16),
      "load more"
    );
    overlay.cursor = "hand";
    overlay.align = mxConstants.ALIGN_CENTER;
    overlay.offset = new mxPoint(0, 10);
    overlay.addListener(
      mxEvent.CLICK,
      mxUtils.bind(this, function(sender, evt) {
        // add a child of the same type
        // addChild(graph, cell);
      })
    );

    graph.addCellOverlay(cell, overlay);
  };

  /**
   * Handle updates to the cell
   *
   * @memberof mxGraphGridAreaEditor
   */
  applyHandler = (graph, cell, name, newValue) => {
    graph.getModel().beginUpdate();
    try {
      const edit = new mxCellAttributeChange(cell, name, newValue);
      graph.getModel().execute(edit);
    } finally {
      graph.getModel().endUpdate();
    }
  };

  /**
   * handle cancelling a new node
   *
   * @memberof mxGraphGridAreaEditor
   */
  handleCancelNewNode = () => {
    this.state.graph.removeCells([this.state.currentNode]);
    this.setState({ createVisible: false });
  };

  /**
   * handle confirming creation of new node
   *
   * @memberof mxGraphGridAreaEditor
   */
  handleConfirmNewNode = fields => {
    const { graph } = this.state;
    const cell = graph.getSelectionCell();

    // check the id of the cell
    let id = fields.id || uuid();
    this.applyHandler(graph, cell, "text", fields.taskName);
    this.applyHandler(graph, cell, "desc", fields.taskDesc);
    cell.setId(id);
    this.setState({ createVisible: false });
  };

  /**
   * determine if the event affects the graph
   *
   * @memberof mxGraphGridAreaEditor
   */
  graphF = e => {
    const { graph } = this.state;
    var x = mxEvent.getClientX(e);
    var y = mxEvent.getClientY(e);
    var elt = document.elementFromPoint(x, y);
    if (mxUtils.isAncestorNode(graph.container, elt)) {
      return graph;
    }
    return null;
  };

  /**
   * Specifies graph settings for moving elements, etc.
   *
   * @memberof mxGraphGridAreaEditor
   */
  loadGlobalSetting = () => {
    // enable guides
    mxGraphHandler.prototype.guidesEnabled = true;

    // disable the guides if the alt key is held down
    mxGuide.prototype.isEnabledForEvent = function(e) {
      return !mxEvent.isAltDown(e);
    };

    // way points should snap to the routing centers of terminals
    mxEdgeHandler.prototype.snapToTerminals = true;
    mxConstraintHandler.prototype.pointImage = new mxImage(
      "../../images/point.gif",
      5,
      5
    );
  };

  /**
   * Construct a DIV and format it to provide UI
   * during the dragging event
   *
   * @memberof mxGraphGridAreaEditor
   */
  getEditPreview = () => {
    var dragElt = document.createElement("div");
    dragElt.style.border = "dashed black 1px";
    dragElt.style.width = "120px";
    dragElt.style.height = "40px";
    return dragElt;
  };

  /**
   * create the drag element on the graph
   *
   * @memberof mxGraphGridAreaEditor
   */
  createDragElement = () => {
    const { graph } = this.state;
    const tasksDrag = ReactDOM.findDOMNode(
      this.refs.mxSidebar
    ).querySelectorAll(".task");
    Array.prototype.slice.call(tasksDrag).forEach(ele => {
      const value = ele.getAttribute("data-value");
      let ds = mxUtils.makeDraggable(
        ele,
        this.graphF,
        (graph, evt, target, x, y) =>
          this.funct(graph, evt, target, x, y, value),
        this.dragElt,
        null,
        null,
        graph.autoscroll,
        true
      );
      ds.isGuidesEnabled = function() {
        return graph.graphHandler.guidesEnabled;
      };
      ds.createDragElement = mxDragSource.prototype.createDragElement;
    });
  };

  /**
   * handle the selection change event
   *
   * @memberof mxGraphGridAreaEditor
   */
  selectionChange = (sender, evt) => {
    // console.log(sender)
  };

  /**
   * handle the selection changed evewt
   * indicating that we are done with
   * changing the selection
   *
   * @memberof mxGraphGridAreaEditor
   */
  selectionChanged = (graph, value) => {
    this.setState({
      createVisible: true,
      currentNode: graph.getSelectionCell(),
      currentTask: value
    });
  };

  /**
   * create a popup menu on the graph, when requested
   *
   * @memberof mxGraphGridAreaEditor
   */
  createPopupMenu = (graph, menu, cell, evt) => {
    if (cell) {
      if (cell.edge === true) {
        menu.addItem("Delete Link", null, function() {
          graph.removeCells([cell]);
          mxEvent.consume(evt);
        });
      } else {
        //menu.addItem("Edit task", null, function () {
        // mxUtils.alert('Edit child node: ');
        // selectionChanged(graph)
        //});
        menu.addItem("Delete Item", null, function() {
          graph.removeCells([cell]);
          mxEvent.consume(evt);
        });
      }
    }
  };

  /**
   * Set default setting for graph
   *
   * @memberof mxGraphGridAreaEditor
   */
  setGraphSetting = () => {
    const { graph } = this.state;
    const that = this;
    graph.gridSize = 30;
    graph.setPanning(true);
    graph.setTooltips(true);
    graph.setConnectable(true);
    graph.setCellsEditable(true);
    graph.setEnabled(true);
    graph.setHtmlLabels(true);
    graph.centerZoom = true;
    graph.autoSizeCellsOnAdd = true;

    // set up the keyhandler to attach to the graph
    const keyHandler = new mxKeyHandler(graph);
    keyHandler.bindKey(46, function(evt) {
      if (graph.isEnabled()) {
        const currentNode = graph.getSelectionCell();
        if (currentNode.edge === true) {
          graph.removeCells([currentNode]);
        }
      }
    });
    keyHandler.bindKey(37, function() {
      //console.log(37);
    });

    // define a rubber band
    new mxRubberband(graph);

    // set the tooltip function for a cell
    graph.getTooltipForCell = function(cell) {
      return cell.getAttribute("desc");
    };

    // define the default vertex style
    var style = [];
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_FILLCOLOR] = "#C3D9FF";
    style[mxConstants.STYLE_STROKECOLOR] = "#6482B9";
    style[mxConstants.STYLE_FONTCOLOR] = "#222222";
    style[mxConstants.HANDLE_FILLCOLOR] = "#80c6ee";
    graph.getStylesheet().putDefaultVertexStyle(style);

    // define the default edge style
    style = [];
    style[mxConstants.STYLE_STROKECOLOR] = "#f90";
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
    style[mxConstants.STYLE_FONTSIZE] = "10";
    style[mxConstants.VALID_COLOR] = "#27bf81";
    graph.getStylesheet().putDefaultEdgeStyle(style);

    // define the handle for the popup menu
    graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
      return that.createPopupMenu(graph, menu, cell, evt);
    };

    graph.convertValueToString = function(cell) {
      // Returns a DOM for the label
      var div = document.createElement("div");
      if (
        mxUtils.isNode(cell.value) &&
        cell.value.nodeName.toLowerCase() === "taskobject"
      ) {
        // extract from the cell some values
        let _t = cell.getAttribute("text", "");
        let _l = cell.getAttribute("label");
        let _p = cell.getAttribute("projid", "");

        // Returns a DOM for the label
        var div = document.createElement("div");
        div.setAttribute("class", "taskWrapper");
        div.innerHTML = `<span class='taskTitle'>${_t}</span>`;
        mxUtils.br(div);

        var p = document.createElement("p");
        p.setAttribute("class", "taskName");
        p.innerHTML = _l;
        div.appendChild(p);
      }
      return div;
    };
  };

  /**
   * create the xml data element for a new node
   *
   * @memberof mxGraphGridAreaEditor
   */
  funct = (graph, evt, target, x, y, value) => {
    var doc = mxUtils.createXmlDocument();
    var obj = doc.createElement("TaskObject");
    obj.setAttribute("label", value);
    obj.setAttribute("text", "");
    obj.setAttribute("desc", "");
    obj.setAtrribute("projid", "");

    var parent = graph.getDefaultParent();
    let cell = graph.insertVertex(
      parent,
      target,
      obj,
      x,
      y,
      150,
      60,
      "strokeColor=#000000;strokeWidth=1;fillColor=white"
    );
    this.addOverlays(graph, cell, true);
    graph.setSelectionCell(cell);
    this.selectionChanged(graph, value);
    // if (cells != null && cells.length > 0)
    // {
    // 	graph.scrollCellToVisible(cells[0]);
    // 	graph.setSelectionCells(cells);
    // }
  };

  /**
   * define the base layout
   *
   * @memberof mxGraphGridAreaEditor
   */
  setLayoutSetting = layout => {
    layout.parallelEdgeSpacing = 10;
    layout.useBoundingBox = false;
    layout.edgeRouting = false;
    layout.levelDistance = 60;
    layout.nodeDistance = 16;
    layout.parallelEdgeSpacing = 10;
    layout.isVertexMovable = function(cell) {
      return true;
    };
    layout.localEdgeProcessing = function(node) {
      console.log(node);
    };
  };

  /**
   * set the connection between items
   *
   * @memberof mxGraphGridAreaEditor
   */
  settingConnection = () => {
    const { graph } = this.state;
    mxConstraintHandler.prototype.intersects = function(
      icon,
      point,
      source,
      existingEdge
    ) {
      return !source || existingEdge || mxUtils.intersects(icon.bounds, point);
    };

    var mxConnectionHandlerUpdateEdgeState =
      mxConnectionHandler.prototype.updateEdgeState;
    mxConnectionHandler.prototype.updateEdgeState = function(pt, constraint) {
      if (pt != null && this.previous != null) {
        var constraints = this.graph.getAllConnectionConstraints(this.previous);
        var nearestConstraint = null;
        var dist = null;

        for (var i = 0; i < constraints.length; i++) {
          var cp = this.graph.getConnectionPoint(this.previous, constraints[i]);

          if (cp != null) {
            var tmp =
              (cp.x - pt.x) * (cp.x - pt.x) + (cp.y - pt.y) * (cp.y - pt.y);

            if (dist == null || tmp < dist) {
              nearestConstraint = constraints[i];
              dist = tmp;
            }
          }
        }

        if (nearestConstraint != null) {
          this.sourceConstraint = nearestConstraint;
        }

        // In case the edge style must be changed during the preview:
        // this.edgeState.style['edgeStyle'] = 'orthogonalEdgeStyle';
        // And to use the new edge style in the new edge inserted into the graph,
        // update the cell style as follows:
        //this.edgeState.cell.style = mxUtils.setStyle(this.edgeState.cell.style, 'edgeStyle', this.edgeState.style['edgeStyle']);
      }

      mxConnectionHandlerUpdateEdgeState.apply(this, arguments);
    };

    if (graph.connectionHandler.connectImage == null) {
      graph.connectionHandler.isConnectableCell = function(cell) {
        return false;
      };
      mxEdgeHandler.prototype.isConnectableCell = function(cell) {
        return graph.connectionHandler.isConnectableCell(cell);
      };
    }

    graph.getAllConnectionConstraints = function(terminal) {
      if (terminal != null && this.model.isVertex(terminal.cell)) {
        return [
          new mxConnectionConstraint(new mxPoint(0.5, 0), true),
          new mxConnectionConstraint(new mxPoint(0, 0.5), true),
          new mxConnectionConstraint(new mxPoint(1, 0.5), true),
          new mxConnectionConstraint(new mxPoint(0.5, 1), true)
        ];
      }
      return null;
    };

    // Connect preview
    graph.connectionHandler.createEdgeState = function(me) {
      var edge = graph.createEdge(
        null,
        null,
        "Edge",
        null,
        null,
        //"edgeStyle=orthogonalEdgeStyle"
        ""
      );

      return new mxCellState(
        this.graph.view,
        edge,
        this.graph.getCellStyle(edge)
      );
    };
  };

  /**
   * handle the save call from the toolbar
   *
   * @memberof mxGraphGridAreaEditor
   */
  handleSave = e => {
    window.alert("TEMP MESSAGE\n\nSaving mindmap...\n\nClick OK to continue.");
  };

  /**
   * zoom in the graph
   *
   * @memberof mxGraphGridAreaEditor
   */
  handleZoomIn = e => {
    const { graph } = this.state;
    graph.zoomIn();
  };

  /**
   * zoom out the graph
   *
   * @memberof mxGraphGridAreaEditor
   */
  handleZoomOut = e => {
    const { graph } = this.state;
    graph.zoomOut();
  };

  /**
   * zoom in the graph
   *
   * @memberof mxGraphGridAreaEditor
   */
  handleZoomRestore = e => {
    const { graph } = this.state;
    graph.zoomActual();
    const zoom = { zoomFactor: 1 };
    this.setState({
      graph: { ...graph, ...zoom }
    });
  };

  /**
   * handle an undo request
   *
   * @memberof mxGraphGridAreaEditor
   */
  handleUndo = e => {
    const { manager } = this.state.undo;
    manager.undo();
  };

  /**
   * handle a redo request
   *
   * @memberof mxGraphGridAreaEditor
   */
  handleRedo = e => {
    const { manager } = this.state.undo;
    manager.redo();
  };

  /**
   * handle the request to dump JSON for debugging
   *
   * @memberof mxGraphGridAreaEditor
   */
  handleDumpJSON = e => {
    const { graph } = this.state;
    const jsonNodes = this.getJsonModel(graph);
    let jsonStr = this.stringifyWithoutCircular(jsonNodes);
    this.setState({
      json: jsonStr
    });
    console.log(jsonStr);
  };

  /**
   * create the undo manager
   *
   * @memberof mxGraphGridAreaEditor
   */
  initUndoManager = () => {
    // get the graph
    const { graph, undo } = this.state;
    const { manager, listener } = undo;

    // define the undo manager
    manager = new mxUndoManager();

    // define the function
    listener = function(sender, evt) {
      manager.undoableEditHappened(evt.getProperty("edit"));
    };

    // set the links to the view and model
    graph.getModel().addListener(mxEvent.UNDO, listener);
    graph.getView().addListener(mxEvent.UNDO, listener);
  };

  LoadGraph(data) {
    var container = ReactDOM.findDOMNode(this.refs.divGraph);
    // Checks if the browser is supported
    if (!mxClient.isBrowserSupported()) {
      // Displays an error message if the browser is not supported.
      mxUtils.error("Browser is not supported", 200, false);
    } else {
      var graph = new mxGraph(container);
      this.setState(
        {
          graph: graph,
          dragElt: this.getEditPreview()
        },
        () => {
          // layout
          const layout = new mxCompactTreeLayout(graph, false);
          this.setState({ layout });
          this.setLayoutSetting(layout);
          this.loadGlobalSetting();
          this.setGraphSetting();
          this.initUndoManager();
          this.initToolbar();
          this.settingConnection();
          this.createDragElement();
          //var parent = graph.getDefaultParent();

          // Adds cells to the model in a single step
          graph.getModel().beginUpdate();
          try {
            // var v0 = graph.insertVertex(
            //   parent,
            //   null,
            //   "dgfgdg,",
            //   120,
            //   240,
            //   80,
            //   30,
            //   "shape=ellipse"
            // );
            // var v1 = graph.insertVertex(parent, null, "Hello,", 20, 20, 80, 30);
            // var v2 = graph.insertVertex(
            //   parent,
            //   null,
            //   "World!",
            //   200,
            //   150,
            //   80,
            //   30
            // );
            // var e1 = graph.insertEdge(parent, null, "", v1, v2);
          } finally {
            // Updates the display
            graph.getModel().endUpdate();
          }
        }
      );
      // Disables the built-in context menu
      mxEvent.disableContextMenu(container);
      // Trigger event after selection
      graph
        .getSelectionModel()
        .addListener(mxEvent.CHANGE, this.selectionChange);
      //var parent = graph.getDefaultParent();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <ul className="sidebar" ref="mxSidebar">
          <li className="title" data-title="Task node" data-value="Task node">
            <em>Drag Onto The Graph</em>
          </li>
          <li className="task" data-title="Concept" data-value="concept">
            Concept
          </li>
          <li className="task" data-title="Analysis" data-value="analysis">
            Analysis
          </li>
          <li className="task" data-title="Project" data-value="project">
            Project
          </li>
        </ul>
        <div className="toolbar" ref="toolbar">
          <MindMapToolbarButtons
            callbacks={this.state.callbacks}
            classes={classes}
          />
        </div>
        <div className="container-wrapper">
          <div className="container" ref="divGraph" />
        </div>
        <div className="changeInput" style={{ zIndex: 10 }} />
        {this.state.createVisible && (
          <CreateTaskNode
            currentTask={this.state.currentTask}
            visible={this.state.createVisible}
            handleCancel={this.handleCancel}
            handleConfirm={this.handleConfirm}
          />
        )}
      </React.Fragment>
    );
  }
}
