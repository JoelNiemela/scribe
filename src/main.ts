import MarkdownView from "./markdown_view";
import VisualView from "./visual_view";
import ScribeSchema from "./schema";

import "prosemirror-view/style/prosemirror.css";
import "prosemirror-menu/style/menu.css";
import "prosemirror-example-setup/style/style.css";
import { EditorState, Transaction } from "prosemirror-state";


const SCRIBE_SCHEMA = new ScribeSchema();

export function setFont(font: string) {
  return (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    const { from, to } = state.selection;
    let tr = state.tr;
    if (font === "default") {
      tr = tr.removeMark(from, to, SCRIBE_SCHEMA.marks.fontMark);
    } else {
      const fontMark = SCRIBE_SCHEMA.marks.fontMark.create({ family: font });
      tr = tr.removeMark(from, to, SCRIBE_SCHEMA.marks.fontMark);
      tr = tr.addMark(from, to, fontMark);
    }

    dispatch(tr.scrollIntoView());
    return true;
  }
}

function getElement<T extends Element = HTMLElement>(id: string): T {
  const el: T | null = document.querySelector(id);
  if (el === null) throw new Error(`Element ${id} not in DOM!`);
  return el;
}

function main() {
  const fontPicker: HTMLSelectElement = getElement<HTMLSelectElement>('#font-picker');
  fontPicker.addEventListener("change", (e: Event) => {
    const font = fontPicker.value;
    if (view instanceof MarkdownView) return; // Changing the font does noting in MarkdownView currently
    setFont(font)(view.view.state, view.view.dispatch, /* view.view */);
  });
  
  const content = 'Hello World';
  
  const target = getElement("#editor");
  
  let view: MarkdownView | VisualView = new VisualView(target, SCRIBE_SCHEMA, content);
  document.querySelectorAll("input[type=radio]").forEach((button: Element) => {
    const radioButton = button as HTMLInputElement;
    radioButton.addEventListener("change", () => {
      if (!radioButton.checked) return;
      const ViewCls = radioButton.value == "markdown" ? MarkdownView : VisualView;
      if (view instanceof ViewCls) return;
      const content = view.content;
      view.destroy();
      view = new ViewCls(target, SCRIBE_SCHEMA, content);
      view.focus();
    })
  })
}

main();
