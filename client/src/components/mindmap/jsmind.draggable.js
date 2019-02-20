/*
 * Released under BSD License
 * Copyright (c) 2014-2015 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

(function($w) {
  //'use strict';
  const $d = $w.document;
  const __name__ = "jsMind";
  const jsMind = $w[__name__];
  if (!jsMind) {
    return;
  }
  if (typeof jsMind.draggable !== "undefined") {
    return;
  }

  const jdom = jsMind.util.dom;
  const jcanvas = jsMind.util.canvas;

  const clear_selection =
    "getSelection" in $w
      ? function() {
          $w.getSelection().removeAllRanges();
        }
      : function() {
          $d.selection.empty();
        };

  const options = {
    line_width: 5,
    lookup_delay: 500,
    lookup_interval: 80
  };

  jsMind.draggable = function(jm) {
    this.jm = jm;
    this.e_canvas = null;
    this.canvas_ctx = null;
    this.shadow = null;
    this.shadow_w = 0;
    this.shadow_h = 0;
    this.active_node = null;
    this.target_node = null;
    this.target_direct = null;
    this.client_w = 0;
    this.client_h = 0;
    this.offset_x = 0;
    this.offset_y = 0;
    this.hlookup_delay = 0;
    this.hlookup_timer = 0;
    this.capture = false;
    this.moved = false;
  };

  jsMind.draggable.prototype = {
    init: function() {
      this._create_canvas();
      this._create_shadow();
      this._event_bind();
    },

    resize: function() {
      this.jm.view.e_nodes.appendChild(this.shadow);
      this.e_canvas.width = this.jm.view.size.w;
      this.e_canvas.height = this.jm.view.size.h;
    },

    _create_canvas: function() {
      const c = $d.createElement("canvas");
      this.jm.view.e_panel.appendChild(c);
      const ctx = c.getContext("2d");
      this.e_canvas = c;
      this.canvas_ctx = ctx;
    },

    _create_shadow: function() {
      const s = $d.createElement("jmnode");
      s.style.visibility = "hidden";
      s.style.zIndex = "3";
      s.style.cursor = "move";
      s.style.opacity = "0.7";
      this.shadow = s;
    },

    reset_shadow: function(el) {
      const s = this.shadow.style;
      this.shadow.innerHTML = el.innerHTML;
      s.left = el.style.left;
      s.top = el.style.top;
      s.width = el.style.width;
      s.height = el.style.height;
      s.backgroundImage = el.style.backgroundImage;
      s.backgroundSize = el.style.backgroundSize;
      s.transform = el.style.transform;
      this.shadow_w = this.shadow.clientWidth;
      this.shadow_h = this.shadow.clientHeight;
    },

    show_shadow: function() {
      if (!this.moved) {
        this.shadow.style.visibility = "visible";
      }
    },

    hide_shadow: function() {
      this.shadow.style.visibility = "hidden";
    },

    clear_lines: function() {
      jcanvas.clear(
        this.canvas_ctx,
        0,
        0,
        this.jm.view.size.w,
        this.jm.view.size.h
      );
    },

    _magnet_shadow: function(node) {
      if (node) {
        this.canvas_ctx.lineWidth = options.line_width;
        this.canvas_ctx.strokeStyle = "rgba(0,0,0,0.3)";
        this.canvas_ctx.lineCap = "round";
        this.clear_lines();
        jcanvas.lineto(
          this.canvas_ctx,
          node.sp.x,
          node.sp.y,
          node.np.x,
          node.np.y
        );
      }
    },

    _lookup_close_node: function() {
      const root = this.jm.get_root();
      const root_location = root.get_location();
      const root_size = root.get_size();
      const root_x = root_location.x + root_size.w / 2;

      const sw = this.shadow_w;
      const sh = this.shadow_h;
      const sx = this.shadow.offsetLeft;
      const sy = this.shadow.offsetTop;

      let ns, nl;

      const direct =
        sx + sw / 2 >= root_x ? jsMind.direction.right : jsMind.direction.left;
      const nodes = this.jm.mind.nodes;
      let node = null;
      let min_distance = Number.MAX_VALUE;
      let distance = 0;
      let closest_node = null;
      let closest_p = null;
      let shadow_p = null;
      for (const nodeid in nodes) {
        var np, sp;
        node = nodes[nodeid];
        if (node.isroot || node.direction === direct) {
          if (node.id === this.active_node.id) {
            continue;
          }
          ns = node.get_size();
          nl = node.get_location();
          if (direct === jsMind.direction.right) {
            if (sx - nl.x - ns.w <= 0) {
              continue;
            }
            distance =
              Math.abs(sx - nl.x - ns.w) +
              Math.abs(sy + sh / 2 - nl.y - ns.h / 2);
            np = { x: nl.x + ns.w - options.line_width, y: nl.y + ns.h / 2 };
            sp = { x: sx + options.line_width, y: sy + sh / 2 };
          } else {
            if (nl.x - sx - sw <= 0) {
              continue;
            }
            distance =
              Math.abs(sx + sw - nl.x) +
              Math.abs(sy + sh / 2 - nl.y - ns.h / 2);
            np = { x: nl.x + options.line_width, y: nl.y + ns.h / 2 };
            sp = { x: sx + sw - options.line_width, y: sy + sh / 2 };
          }
          if (distance < min_distance) {
            closest_node = node;
            closest_p = np;
            shadow_p = sp;
            min_distance = distance;
          }
        }
      }
      let result_node = null;
      if (closest_node) {
        result_node = {
          node: closest_node,
          direction: direct,
          sp: shadow_p,
          np: closest_p
        };
      }
      return result_node;
    },

    lookup_close_node: function() {
      const node_data = this._lookup_close_node();
      if (node_data) {
        this._magnet_shadow(node_data);
        this.target_node = node_data.node;
        this.target_direct = node_data.direction;
      }
    },

    _event_bind: function() {
      const jd = this;
      const container = this.jm.view.container;
      jdom.add_event(container, "mousedown", e => {
        const evt = e || window.event;
        jd.dragstart.call(jd, evt);
      });
      jdom.add_event(container, "mousemove", e => {
        const evt = e || window.event;
        jd.drag.call(jd, evt);
      });
      jdom.add_event(container, "mouseup", e => {
        const evt = e || window.event;
        jd.dragend.call(jd, evt);
      });
      jdom.add_event(container, "touchstart", e => {
        const evt = e || window.event;
        jd.dragstart.call(jd, evt);
      });
      jdom.add_event(container, "touchmove", e => {
        const evt = e || window.event;
        jd.drag.call(jd, evt);
      });
      jdom.add_event(container, "touchend", e => {
        const evt = e || window.event;
        jd.dragend.call(jd, evt);
      });
    },

    dragstart: function(e) {
      if (!this.jm.get_editable()) {
        return;
      }
      if (this.capture) {
        return;
      }
      this.active_node = null;

      const jview = this.jm.view;
      const el = e.target || window.event.srcElement;
      if (el.tagName.toLowerCase() !== "jmnode") {
        return;
      }
      const nodeid = jview.get_binded_nodeid(el);
      if (nodeid) {
        const node = this.jm.get_node(nodeid);
        if (!node.isroot) {
          this.reset_shadow(el);
          this.active_node = node;
          this.offset_x = (e.clientX || e.touches[0].clientX) - el.offsetLeft;
          this.offset_y = (e.clientY || e.touches[0].clientY) - el.offsetTop;
          this.client_hw = Math.floor(el.clientWidth / 2);
          this.client_hh = Math.floor(el.clientHeight / 2);
          if (this.hlookup_delay !== 0) {
            $w.clearTimeout(this.hlookup_delay);
          }
          if (this.hlookup_timer !== 0) {
            $w.clearInterval(this.hlookup_timer);
          }
          const jd = this;
          this.hlookup_delay = $w.setTimeout(() => {
            jd.hlookup_delay = 0;
            jd.hlookup_timer = $w.setInterval(() => {
              jd.lookup_close_node.call(jd);
            }, options.lookup_interval);
          }, options.lookup_delay);
          this.capture = true;
        }
      }
    },

    drag: function(e) {
      if (!this.jm.get_editable()) {
        return;
      }
      if (this.capture) {
        e.preventDefault();
        this.show_shadow();
        this.moved = true;
        clear_selection();
        const px = (e.clientX || e.touches[0].clientX) - this.offset_x;
        const py = (e.clientY || e.touches[0].clientY) - this.offset_y;
        //var cx = px + this.client_hw;
        //var cy = py + this.client_hh;
        this.shadow.style.left = px + "px";
        this.shadow.style.top = py + "px";
        clear_selection();
      }
    },

    dragend: function(e) {
      if (!this.jm.get_editable()) {
        return;
      }
      if (this.capture) {
        if (this.hlookup_delay !== 0) {
          $w.clearTimeout(this.hlookup_delay);
          this.hlookup_delay = 0;
          this.clear_lines();
        }
        if (this.hlookup_timer !== 0) {
          $w.clearInterval(this.hlookup_timer);
          this.hlookup_timer = 0;
          this.clear_lines();
        }
        if (this.moved) {
          const src_node = this.active_node;
          const target_node = this.target_node;
          const target_direct = this.target_direct;
          this.move_node(src_node, target_node, target_direct);
        }
        this.hide_shadow();
      }
      this.moved = false;
      this.capture = false;
    },

    move_node: function(src_node, target_node, target_direct) {
      const shadow_h = this.shadow.offsetTop;
      if (
        !!target_node &&
        !!src_node &&
        !jsMind.node.inherited(src_node, target_node)
      ) {
        // lookup before_node
        const sibling_nodes = target_node.children;
        let sc = sibling_nodes.length;
        let node = null;
        let delta_y = Number.MAX_VALUE;
        let node_before = null;
        let beforeid = "_last_";
        while (sc--) {
          node = sibling_nodes[sc];
          if (node.direction === target_direct && node.id !== src_node.id) {
            const dy = node.get_location().y - shadow_h;
            if (dy > 0 && dy < delta_y) {
              delta_y = dy;
              node_before = node;
              beforeid = "_first_";
            }
          }
        }
        if (node_before) {
          beforeid = node_before.id;
        }
        this.jm.move_node(src_node.id, beforeid, target_node.id, target_direct);
      }
      this.active_node = null;
      this.target_node = null;
      this.target_direct = null;
    },

    jm_event_handle: function(type, data) {
      if (type === jsMind.event_type.resize) {
        this.resize();
      }
    }
  };

  const draggable_plugin = new jsMind.plugin("draggable", jm => {
    const jd = new jsMind.draggable(jm);
    jd.init();
    jm.add_event_listener((type, data) => {
      jd.jm_event_handle.call(jd, type, data);
    });
  });

  jsMind.register_plugin(draggable_plugin);
})(window);
