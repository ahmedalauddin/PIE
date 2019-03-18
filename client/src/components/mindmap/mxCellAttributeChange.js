/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/components/mindmap/mxCellAttributeChange.js
 * Created:  2019-03-14 14:48:57
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-16 22:22:52
 * Editor:   Darrin Tisdale
 */

/**
 * class used to handle ataribute changes to cells
 *
 * @export
 * @class mxCellAttributeChange
 */
export default class mxCellAttributeChange {
  /**
   * Creates an instance of mxCellAttributeChange.
   * @param {*} cell
   * @param {*} attribute
   * @param {*} value
   * @memberof mxCellAttributeChange
   */
  constructor(cell, attribute, value) {
    this.cell = cell;
    this.attribute = attribute;
    this.value = value;
    this.previous = value;
  }

  /**
   * standard function called for handling the change
   *
   * @memberof mxCellAttributeChange
   */
  execute() {
    // make sure that there is something to change
    if (this.cell != null) {
      // get the current value form the cell
      var tmp = this.cell.getAttribute(this.attribute);

      // was the value passed in null?
      if (this.previous == null) {
        // yes, so remove the attribute entirely
        this.cell.value.removeAttribute(this.attribute);
      } else {
        // no, set the value of the attribute
        this.cell.setAttribute(this.attribute, this.previous);
      }

      // store the previous value
      this.previous = tmp;
    }
  }
}
