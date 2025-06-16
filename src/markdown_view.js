export default class MarkdownView {
  constructor(target, schema, content) {
    this.textarea = target.appendChild(document.createElement("textarea"))
    this.textarea.style.width  = '1000px';
    this.textarea.style.height = '240px';
    this.textarea.value = content
  }

  get content() { return this.textarea.value }
  focus() { this.textarea.focus() }
  destroy() { this.textarea.remove() }
}
