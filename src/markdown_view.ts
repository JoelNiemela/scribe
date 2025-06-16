import { Schema } from "prosemirror-model";

export default class MarkdownView {
  private textarea: HTMLTextAreaElement;

  constructor(target: Node, _: Schema, content: string) {
    this.textarea = target.appendChild(document.createElement("textarea"))
    this.textarea.style.width  = '1000px';
    this.textarea.style.height = '240px';
    this.textarea.value = content
  }

  get content() { return this.textarea.value }
  focus() { this.textarea.focus() }
  destroy() { this.textarea.remove() }
}
