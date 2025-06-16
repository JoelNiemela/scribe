import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { exampleSetup } from "prosemirror-example-setup";

import CustomMarkdownParser from "./parser";
import scribeSerializer from "./serializer";
import { onRenderPlugin } from "./on_update";
import { MarkdownSerializer } from "prosemirror-markdown";
import { Schema } from "prosemirror-model";

export default class VisualView {
  public parser: CustomMarkdownParser;
  public serializer: MarkdownSerializer;
  public view: EditorView;

  constructor(target: Node, schema: Schema, content: string) {
    this.parser = new CustomMarkdownParser(schema);
    this.serializer = scribeSerializer(/* schema */);

    this.view = new EditorView(target, {
      state: EditorState.create({
        doc: this.parser.parse(content),
        schema: schema,
        plugins: [
          ...exampleSetup({ schema: schema }),
          onRenderPlugin,
        ],
      })
    })
  }

  get content() {
    return this.serializer.serialize(this.view.state.doc)
  }
  focus() { this.view.focus() }
  destroy() { this.view.destroy() }
}
