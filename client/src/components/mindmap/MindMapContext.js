/**
 * Project:  valueinfinity-mvp-client
 * File:     /src/components/mindmap/MindMapContext.js
 * Created:  2019-03-17 16:07:53
 * Author:   Darrin Tisdale
 * -----
 * Modified: 2019-03-17 16:13:37
 * Editor:   Darrin Tisdale
 */

const MindMapContext = React.createContext({
  data: {},
  id: {},
  update: data => {}
});

export default MindMapContext;
