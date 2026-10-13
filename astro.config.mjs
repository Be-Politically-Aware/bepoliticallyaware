import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://bepoliticallyaware.org",
  markdown: { syntaxHighlight: false },
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
