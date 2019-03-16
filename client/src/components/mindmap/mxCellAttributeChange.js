/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/components/mindmap/mxCellAttributeChange.js
 * Created:  2019-03-14 14:48:57
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-16 15:06:44
 * Editor:   Darrin Tisdale
 */

export default class mxCellAttributeChange {
  // constructor
  constructor(cell, attribute, value) {
    this.cell = cell;
    this.attribute = attribute;
    this.value = value;
    this.previous = value;
  }
  // Method
  execute() {
    if (this.cell != null) {
      var tmp = this.cell.getAttribute(this.attribute);

      if (this.previous == null) {
        this.cell.value.removeAttribute(this.attribute);
      } else {
        this.cell.setAttribute(this.attribute, this.previous);
      }

      this.previous = tmp;
    }
  }
}
