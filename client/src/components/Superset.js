/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/Superset.js
 * Descr:    Wrapper component for Apache Superset.
 * Created:  2019-04-04
 * Author:   Brad Kaufman
 * -----
 * Modified:
 * Editor:   Brad Kaufman
 * Notes:
 */
import zoid from "zoid";

const SupersetZoidComponent = zoid.create({
  // The html tag used to render my component
  tag: "superset-component",
  // The url that will be loaded in the iframe or popup, when someone includes my component on their page
  url: "http://ec2-13-59-69-6.us-east-2.compute.amazonaws.com:8088"
});

export default SupersetZoidComponent;
