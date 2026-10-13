import { Marked, Renderer } from "marked";
import sanitizeHtml from "sanitize-html";

export function escapeHtml(text: string) {
  return text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
}

export function renderMarkdown(body: string, evidenceTable?: string) {
  const headings: { id: string; text: string }[] = [];
  const ids = new Map<string, number>();
  let lastHeading = "Evidence table";
  const defaults = new Renderer();
  const parser = new Marked({
    gfm: true,
    renderer: {
      html() {
        return "";
      },
      heading({ tokens, depth, text }) {
        const base = `section-${text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/-$/, "")}`;
        const count = ids.get(base) ?? 0;
        ids.set(base, count + 1);
        const id = count ? `${base}-${count}` : base;
        lastHeading = text;
        if (depth === 2) headings.push({ id, text });
        return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>`;
      },
      link(token) {
        if (/^\d+$/.test(token.text) && /^https?:/.test(token.href)) {
          return `<a class="citation" href="#source-${token.text}" aria-label="Source ${token.text}">[${token.text}]</a>`;
        }
        defaults.parser = this.parser;
        return defaults.link(token);
      },
      table(token) {
        if (evidenceTable) return evidenceTable;
        defaults.parser = this.parser;
        const table = defaults
          .table(token)
          .replace(
            "<table>",
            `<table><caption>${escapeHtml(lastHeading)}</caption>`,
          )
          .replace(/<th(?=[ >])/g, '<th scope="col"');
        return `<div class="table-scroll" tabindex="0" role="region" aria-label="${escapeHtml(lastHeading)}">${table}</div>`;
      },
    },
  });
  const html = sanitizeHtml(parser.parse(body, { async: false }), {
    allowedTags: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "strong",
      "em",
      "blockquote",
      "code",
      "pre",
      "br",
      "hr",
      "div",
      "table",
      "caption",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    allowedAttributes: {
      a: ["href", "title", "aria-label", "class"],
      div: ["class", "tabindex", "role", "aria-label"],
      th: ["scope"],
      "*": ["id"],
    },
    allowedSchemes: ["https", "http", "mailto"],
    allowProtocolRelative: false,
  });
  return { html, headings };
}

export function plainText(body: string) {
  const html = renderMarkdown(body).html.replace(
    /<\/(?:h[1-6]|p|li|td|th)>/g,
    "$& ",
  );
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
}
