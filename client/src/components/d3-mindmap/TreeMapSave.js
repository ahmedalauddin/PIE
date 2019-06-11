import React from "react";
import * as d3 from "d3";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Topbar from "../Topbar";
import {red, grey} from "@material-ui/core/colors";
import "./tree-styles.scss";

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
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
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
const m = [20, 120, 20, 120];
const w = 900 - m[1] - m[3];
const h = 500 - m[0] - m[2];
// const diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });
const tree = d3.tree().size([h, w]);

export default class TreeMap extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.update = this.update.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.getDirection = this.getDirection.bind(this);
    this.getRoot = this.getRoot.bind(this);
  }

  state = {
    root: null,
    width: 700,
    height: 500,
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
    data3: [
      {
        name: "Root",
        children: [
          {
            name: "Branch 1",
            children: [
              {name: "Leaf 3"},
              {name: "Leaf 4"}
            ]
          },
          { name: "Branch 2" }
        ]
      }
    ],
  };

  getDirection = (data) => {
    if (!data) {
      return "root";
    }
    if (data.position) {
      return data.position;
    }
    //return this.getDirection(data.parent);
  };

  selectNode = (target) => {
    if(target){
      var sel = d3.selectAll('#body svg .node').filter(function(d){return d.id==target.id})[0][0];
      if(sel){
        this.select(sel);
      }
    }
  };
  setConnector = (type) => {
    var root = this.getRoot();
    this.connector = window[type];
    this.update(root);
  };
  select = (node) => {
    // Find previously selected, unselect
    d3.select(".selected").classed("selected", false);
    // Select current item
    d3.select(node).classed("selected", true);
  };

  tree() {
    const tree = d3.tree().size([this.state.height, this.state.width - 160]);

    const stratify = d3
      .stratify()
      .id(d => {
        return d.name;
      })
      .parentId(d => {
        return d.parent;
      });

    const root = stratify(this.state.data).sort((a, b) => {
      return a.height - b.height || a.id.localeCompare(b.id);
    });

    this.setState({ root, links: tree(root).links() });
  }

  componentDidMount() {
    this.loadJSON(this.state.data3);
  }

  getRoot = () => {
    return this.selectNode("root");
  };

  loadJSON = (jsonData) => {
    d3.json(jsonData, function(json) {
      var root;

      json = JSON.parse(jsonData);
      var i=0, l=json.children.length;
      window.data = root = json;
      root.x0 = h / 2;
      root.y0 = 0;

      json.left = [];
      json.right = [];
      for (; i < l; i++) {
        if (i % 2) {
          json.left.push(json.children[i]);
          json.children[i].position = "left";
        } else {
          json.right.push(json.children[i]);
          json.children[i].position = "right";
        }
      }

      this.update(root, true);
      this.selectNode(root);
    });
  };

  render() {
    const { classes } = this.props;

    if (!this.state.links) {
      return null;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <svg width={this.state.width + 100} height={this.state.height} className="tree-chart" ref={r => (this.chartRef = r)}>
          <g transform="translate(100, 0)">
            {this.renderLinks()}
            {this.renderNodes()}
          </g>
        </svg>
      </React.Fragment>
    );
  }

  renderLinks() {
    return this.state.links.map(function(data, i) {
      const link = d3
        .linkHorizontal()
        .x(d => {
          return d.y;
        })
        .y(d => {
          return d.x;
        });
      return <path key={`link${i}`} className="tree-chart__link" d={link(data)} />;
    });
  }

  renderNodes() {
    return this.state.root.descendants().map((d, i) => {
      return (
        <g key={`node${i}`} className="tree-chart__node" transform={`translate(${d.y},${d.x})`}>
          <circle r="10" />
          <text dy={20} x={-8} textAnchor={d.children ? "start" : "end"}>
            {d.id}
          </text>
        </g>
      );
    });
  }

  toArray = (item, arr, d) => {
    arr = arr || [];
    var dr = d || 1;
    var i = 0, l = item.children?item.children.length:0;
    arr.push(item);
    if(item.position && item.position==='left'){
      dr = -1;
    }
    item.y = dr * item.y;
    for(; i < l; i++){
      this.toArray(item.children[i], arr, dr);
    }
    return arr;
  };

  handleClick = (d, index) => {
    this.select(this);
    this.update(d);
  };

  vis = () => {
    return (d3.select("#body")
      .append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
      .append("svg:g")
      .attr("transform", "translate(" + (w/2 + m[3]) + "," + m[0] + ")")
    );
  };
  update(source, slow) {
    var duration = (d3.event && d3.event.altKey) || slow ? 1000 : 100;
    var root = this.getRoot();
    var connector;
    var i = 0;

    // Compute the new tree layout.
    var nodesLeft = tree
      .size([h, (w/2)-20])
      .children(function(d){
        return ( d.depth===0 ) ? d.left : d.children;
      })
      .nodes(root)
      .reverse();
    var nodesRight = tree
      .size([h, w/2])
      .children(function(d){
        return (d.depth===0)?d.right:d.children;
      })
      .nodes(root)
      .reverse();
    root.children = root.left.concat(root.right);
    root._children = null;
    var nodes = this.toArray(root);

    // Normalize for fixed-depth.
    //nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = this.vis.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("svg:g")
      .attr("class", function(d){ return d.selected?"node selected":"node"; })
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", this.handleClick);

    nodeEnter.append("svg:circle")
      .attr("r", 1e-6);

    nodeEnter.append("svg:text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", 14)
      .attr("text-anchor", "middle")
      .text(function(d) { return (d.name || d.text); })
      .style("fill-opacity", 1);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
    //.attr("class", function(d){ return d.selected?"node selected":"node"; })
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("text")
      .text(function(d) { return (d.name || d.text); });

    nodeUpdate.select("circle")
      .attr("r", 4.5);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // Update the links…
    var link = this.vis.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return connector({source: o, target: o});
      })
      .transition()
      .duration(duration)
      .attr("d", connector);

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", connector);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return connector({source: o, target: o});
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
}
