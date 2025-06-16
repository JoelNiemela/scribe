import MarkdownIt from "markdown-it";
import { MarkdownParser, defaultMarkdownParser } from "prosemirror-markdown";

export default class CustomMarkdownParser {
  constructor(schema) {
    const md = MarkdownIt('commonmark', { html: true });

    md.inline.ruler.before('html_inline', 'font', (state, silent) => {
      const match = /^<font([^>]*)>(.*?)<\/font>/i.exec(state.src.slice(state.pos));
      if (!match) return false;

      const [all, args, content] = match;

      if (!silent) {
        const fontOpen = state.push('font_open', 'font', 1);
        fontOpen.attrs = { 'family': /family="([^"]+)"/.exec(args)?.[1] || null };

        const inline = state.push('inline', '', 0);
        inline.children = [];
        state.md.inline.parse(content, state.md, state.env, inline.children);

        const fontClose = state.push('font_close', 'font', -1);
      }

      state.pos += all.length;
      return true;
    });

    this.parser = new MarkdownParser(
      schema,
      md,
      {
        ...defaultMarkdownParser.tokens,
        font: {
          mark: 'fontMark',
          getAttrs(tok) {
            return { family: tok.attrs.family };
          }
        },
      },
    );
  }

  parse(markdownText) {
    return this.parser.parse(markdownText);
  }
}
