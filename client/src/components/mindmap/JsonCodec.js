/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/components/mindmap/JsonCodec.js
 * Created:  2019-03-14 14:37:28
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-17 17:31:44
 * Editor:   Darrin Tisdale
 */

import { mxObjectCodec, mxUtils } from "mxgraph-js";

/**
 * defines a constant used by the codec
 *
 * @export
 */
export const XML_NODE = "ViGraphObject";

/**
 * *JsonCodec*
 * handles serialization between JSON and XML
 * for graph nodes
 *
 * @export
 * @class JsonCodec
 * @extends {mxObjectCodec}
 */
export default class JsonCodec extends mxObjectCodec {
  /**
   * Creates an instance of JsonCodec.
   * @memberof JsonCodec
   */
  constructor() {
    super(value => {});
  }

  /**
   * create XML from json
   *
   * @param {*} value
   * @returns
   * @memberof JsonCodec
   */
  encode = value => {
    // create a temporary XML document to use for encoding
    let _x = mxUtils.createXmlDocument();

    // create an XML element in the document
    const _o = _x.createElement(XML_NODE);

    // go through all items in the provided object to set its attributes
    for (const _key in value) {
      // retrieve the value
      let _value = value[_key];

      // store the key and value as XML
      _o.setAttribute(_key, _value);
    }

    // return the object created
    return _o;
  };

  /**
   * create json from XML
   *
   * @param {*} model
   * @returns
   * @memberof JsonCodec
   */
  decode = model => {
    return Object.keys(model.cells)
      .map(iCell => {
        const currentCell = model.getCell(iCell);
        return currentCell.value !== undefined ? currentCell : null;
      })
      .filter(item => item !== null);
  };
}
