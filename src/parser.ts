import MarkdownIt from "markdown-it";
import { StateInline, Token } from "markdown-it/index.js";
import { MarkdownParser, defaultMarkdownParser } from "prosemirror-markdown";
import { Schema } from "prosemirror-model";

export default class CustomMarkdownParser {
  public static md: MarkdownIt;
  public parser: MarkdownParser;

  constructor(schema: Schema) {
    const md = MarkdownIt('commonmark', { html: true });

    md.inline.ruler.before('html_inline', 'font', (state: StateInline, silent: boolean) => {
      const match = /^<font([^>]*)>(.*?)<\/font>/i.exec(state.src.slice(state.pos));
      if (!match) return false;

      const [all, args, content] = match;

      if (!silent) {
        const fontOpen = state.push('font_open', 'font', 1);
        const family = /family="([^"]+)"/.exec(args)?.[1];
        if (family) {
          fontOpen.attrSet('family', family);
        }

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
          getAttrs(tok: Token) {
            return { family: tok.attrGet('family') };
          }
        },
      },
    );
  }

  parse(markdownText: string) {
    return this.parser.parse(markdownText);
  }
}
