import tailwindcss from "@tailwindcss/vite";
import { satteri } from "@astrojs/markdown-satteri";
import { defineConfig } from "astro/config";
import {
  readingMarkdownPlugins,
  rejectContributorHtml,
} from "./src/lib/markdown";

export default defineConfig({
  site: "https://bepoliticallyaware.org",
  prerenderConflictBehavior: "error",
  markdown: {
    syntaxHighlight: false,
    processor: satteri({
      features: { smartPunctuation: false, rawHtml: false },
      mdastPlugins: [rejectContributorHtml],
      hastPlugins: [readingMarkdownPlugins],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
});
