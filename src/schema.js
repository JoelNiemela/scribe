import { Schema } from "prosemirror-model";
import { schema } from "prosemirror-markdown";

const fontMark = {
  attrs: { family: { default: 'default' } },
  toDOM(node) {
    return [ 'span', { style: `font-family: ${node.attrs.family};`}];
  },
  parseDOM: [{
    tag: 'font',
    getAttrs(dom) {
      return { family: dom.getAttribute('family') };
    },
  }]
}

export default class ScribeSchema extends Schema {
  constructor() {
    const nodes = schema.spec.nodes;
    const marks = schema.spec.marks.append({
      fontMark: fontMark
    });
    super({ marks, nodes })
  }
}
