import {
  defineHastPlugin,
  defineMdastPlugin,
  htmlToHast,
  type HastPluginEntry,
} from "satteri";
import { sanitize, type Schema } from "hast-util-sanitize";
import type { Root } from "hast";
import sanitizeHtml from "sanitize-html";
import { evidence, evidenceTable } from "./evidence";
import { isNumericTableCell } from "./tables";
import type {} from "@astrojs/markdown-satteri";

const schema: Schema = {
  tagNames: [
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
  attributes: {
    a: ["href", "title", "ariaLabel", ["className", "citation"]],
    div: [
      ["className", "table-scroll", "table-caption"],
      "tabIndex",
      "role",
      "ariaLabel",
    ],
    th: ["scope", ["className", "num"]],
    td: [["className", "num"]],
    "*": ["id"],
  },
  protocols: { href: ["https", "http", "mailto"] },
  // IDs come from the heading plugin below; contributor HTML is removed first.
  clobber: [],
  strip: ["script", "style", "iframe", "object"],
};

export const readingMarkdownPlugins: HastPluginEntry = () => {
  const ids = new Map<string, number>();
  let lastHeading = "Evidence table";
  return [
    defineHastPlugin({
      name: "reading-presentation",
      element: {
        filter: ["h1", "h2", "h3", "h4", "h5", "h6", "a", "table", "th", "td"],
        visit(node, ctx) {
          const text = ctx.textContent(node);
          if (/^h[1-6]$/.test(node.tagName)) {
            const base = `section-${text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/-$/, "")}`;
            const count = ids.get(base) ?? 0;
            ids.set(base, count + 1);
            ctx.setProperty(node, "id", count ? `${base}-${count}` : base);
            lastHeading = text;
          } else if (node.tagName === "a") {
            const href = String(node.properties.href ?? "");
            if (/^[\/\\]{2}/.test(href)) {
              ctx.replaceNode(node, { ...node, properties: {} });
            } else if (/^\d+$/.test(text) && /^https?:/.test(href)) {
              ctx.setProperty(node, "href", `#source-${text}`);
              ctx.setProperty(node, "className", ["citation"]);
              ctx.setProperty(node, "ariaLabel", `Source ${text}`);
            }
          } else if (node.tagName === "table") {
            const card = evidence.find(
              (c) =>
                c.articleId === ctx.data.astro?.frontmatter.id &&
                c.replacesTable,
            );
            if (card) {
              const fragment = htmlToHast(evidenceTable(card), {
                fragment: true,
              }) as Root;
              ctx.replaceNode(node, fragment.children);
              return;
            }
            ctx.prependChild(node, {
              type: "element",
              tagName: "caption",
              properties: {},
              children: [
                {
                  type: "element",
                  tagName: "div",
                  properties: { className: ["table-caption"] },
                  children: [{ type: "text", value: lastHeading }],
                },
              ],
            });
            ctx.wrapNode(node, {
              type: "element",
              tagName: "div",
              properties: {
                className: ["table-scroll"],
                tabIndex: 0,
                role: "region",
                ariaLabel: lastHeading,
              },
              children: [],
            });
          } else {
            if (node.tagName === "th") ctx.setProperty(node, "scope", "col");
            // A linked source number is a citation, not a numeric data cell.
            if (
              node.children.every((child) => child.type === "text") &&
              isNumericTableCell(text)
            )
              ctx.setProperty(node, "className", ["num"]);
          }
        },
      },
    }),
    defineHastPlugin({
      name: "reading-sanitize",
      after(root, ctx) {
        // sanitize returns a new tree; do not clone Sätteri's lazy node wrappers.
        ctx.replaceNode(root, sanitize(root as Root, schema));
      },
    }),
  ];
};

export const rejectContributorHtml = defineMdastPlugin({
  name: "reading-no-raw-html",
  html(node, ctx) {
    ctx.removeNode(node);
  },
  image(node, ctx) {
    ctx.removeNode(node);
  },
});

export function plainText(html: string) {
  return sanitizeHtml(html.replace(/<\/(?:h[1-6]|p|li|td|th)>/g, "$& "), {
    allowedTags: [],
    allowedAttributes: {},
  });
}
