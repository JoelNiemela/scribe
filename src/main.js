import MarkdownView from "./markdown_view";
import VisualView from "./visual_view";
import ScribeSchema from "./schema";

import "prosemirror-view/style/prosemirror.css";
import "prosemirror-menu/style/menu.css";
import "prosemirror-example-setup/style/style.css";

export function setFont(font) {
  return function(state, dispatch) {
    const { from, to } = state.selection;
    let tr = state.tr;
    if (font === "default") {
      tr = tr.removeMark(from, to, schema.marks.fontMark);
    } else {
      const fontMark = schema.marks.fontMark.create({ family: font });
      tr = tr.removeMark(from, to, schema.marks.fontMark);
      tr = tr.addMark(from, to, fontMark);
    }

    dispatch(tr.scrollIntoView());
    return true;
  }
}

const schema = new ScribeSchema()

document.querySelector("#font-picker").addEventListener("change", e => {
  const font = e.target.value;
  setFont(font)(view.view.state, view.view.dispatch, view.view);
});

const content = 'Hello World';

const target = document.querySelector("#editor");

let view = new VisualView(target, schema, content);
document.querySelectorAll("input[type=radio]").forEach(button => {
  button.addEventListener("change", () => {
    if (!button.checked) return;
    const ViewCls = button.value == "markdown" ? MarkdownView : VisualView;
    if (view instanceof ViewCls) return;
    const content = view.content;
    view.destroy();
    view = new ViewCls(target, schema, content);
    view.focus();
  })
})
