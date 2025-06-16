import { Plugin } from "prosemirror-state";

export const onRenderPlugin = new Plugin({
  view(editorView)  {
    return {
      update(view, prevState) {}
    };
  }
})
