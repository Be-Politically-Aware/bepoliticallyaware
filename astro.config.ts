import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://bepoliticallyaware.org",
  prerenderConflictBehavior: "error",
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
