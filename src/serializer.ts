import { MarkdownSerializer, defaultMarkdownSerializer } from "prosemirror-markdown";

export default function scribeSerializer(/* schema */): MarkdownSerializer {
  return new MarkdownSerializer(
    defaultMarkdownSerializer.nodes,
    {
      ...defaultMarkdownSerializer.marks,
      fontMark: {
        open(_state, mark) { return `<font family="${mark.attrs.family}">`; },
        close() { return '</font>'; },
        mixable: true,
        expelEnclosingWhitespace: false,
      },
    }
  );
}
