/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/components/mindmap/JsonCodec.js
 * Created:  2019-03-14 14:37:28
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-14 14:39:59
 * Editor:   Darrin Tisdale
 */

import { mxUtils } from "mxgraph-js";

export class JsonCodec extends mxObjectCodec {
  constructor() {
    super(value => {});
  }
  encode(value) {
    const xmlDoc = mxUtils.createXmlDocument();
    const newObject = xmlDoc.createElement("TaskObject");
    for (let prop in value) {
      newObject.setAttribute(prop, value[prop]);
    }
    return newObject;
  }
  decode(model) {
    return Object.keys(model.cells)
      .map(iCell => {
        const currentCell = model.getCell(iCell);
        return currentCell.value !== undefined ? currentCell : null;
      })
      .filter(item => item !== null);
  }
}
