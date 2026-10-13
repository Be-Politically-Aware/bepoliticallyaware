# Be Politically Aware

A minimal, static Astro civic-education site for India. All 40 launch articles are supplied content, rendered from Markdown with citations, research-check dates and source limitations intact. Typography uses the system UI stack, with no web fonts. No accounts, tracking, third-party embeds or server are required.

## Development

Use Node 22.12+ (or a newer supported Node release) and Bun. Development, builds and validation do not require Python:

```sh
bun install
bun run dev
```

Open http://localhost:4321. Build and check the production site:

```sh
bun run validate
bun run preview
```

`validate` runs the TypeScript content consistency checks, TypeScript and Astro diagnostics, a static build, and Bun tests against that build. `bun run validate:content` runs the content checks alone and writes `checks/validation.json`: exit 0 means passed, 1 means failed checks, and 2 means validation could not complete. `bun run build` also checks types before emitting the site; `bun run check` runs diagnostics alone. `bun test` requires a current `dist/` (run `bun run build` first).

The framework is Astro 7.3.8 (current stable at the October 2026 check), with a typed `astro.config.ts`, Astro's strict TypeScript preset, and typed static route/endpoint exports. Duplicate prerendered routes fail the build. TypeScript 6.0.3 is the newest version supported by the installed Astro checker; do not jump to TypeScript 7 until that tooling supports it. `package.json` records the Bun version and Astro's minimum Node version.

Tailwind CSS 4 uses the official `@tailwindcss/vite` plugin, like the portfolio project. `src/styles/global.css` exposes the existing light/dark tokens through `@theme inline` and uses utilities and `@apply` for shared layout/control primitives. Preflight is deliberately omitted to preserve the reading site's existing reset, native disclosures and typography. Keep content-driven prose, table behavior, print rules and bespoke responsive layout in semantic CSS; no legacy `@astrojs/tailwind` integration is needed.

## Reading and search

- `/` and `/in`: question-led introductions; seven public topic entry points and all hub indexes.
- Exact supplied article routes under `/in/`; six guided paths at `/in/paths`.
- `/in/reference/glossary`: all 46 terms, with an alphabetical index and explanatory links.
- `/sources`: document provenance and limitations. Each article has its own numbered, exact source locators.
- `/search`: full-text ranked search across published titles, summaries, headings and body text, with highlighted excerpts, prefix matching and typo tolerance for longer words. Queries are shareable through `?q=`.
- Cmd/Ctrl+K or `/`: opens search anywhere. `/` does not interrupt typing in inputs. Arrow keys navigate results, Enter opens one, Escape closes the dialog, Tab stays inside it, and focus returns on close. Clicking Search works on touch devices. Search requires JavaScript; article browsing does not.
- Light is the default theme; the toggle remembers an explicit choice locally. Without JavaScript, the system colour preference applies. No analytics storage is used.

The presentation matches the supplied `preview.html`: sharp corners, paper/ink light and dark palettes, underlined green links and amber keyboard focus. A solid sticky desktop header and a 320px sidebar sit within a shared 1540px layout. The numbered index appears on every page; its optional title/summary filter reports the visible article count. Full-text search remains separate. The single reading column is 790px including padding. The sidebar narrows to 250px below 850px, then becomes a native “Browse all 40 articles” disclosure at 640px and below, usable without JavaScript. The mobile header scrolls with the page: brand, search icon and theme toggle on the first row, navigation links on the second. There is no drawer or right rail. Article neighbours follow the published navigation order. Sources expand on citation jumps and remain open without JavaScript, retaining exact locators, dates and limitations.

## Content source of truth

**`content/articles/*.md` is canonical.** Each file contains typed YAML frontmatter and the article body. `src/content.config.ts` uses Astro's native `glob()` loader and a shared Zod schema; pages use `getCollection()` and `render()` with `<Content />`. Only `status === "ready" && publish === true` is included in routes, navigation, search and sitemap. There is no duplicate article JSON, portable exporter or hand-maintained article index.

Edit an article's prose and frontmatter directly, then run:

```sh
bun run validate
```

Keep date values quoted (`"2026-10-13"`), filenames equal to frontmatter IDs, and page titles in frontmatter only. Tasks, related links and source panels are rendered by the article template, not appended to the Markdown body. Reading time and related titles/routes are derived, and full-text search uses Astro's rendered collection HTML with tags and URL noise removed.

Astro 7's native Sätteri pipeline runs presentation and safety plugins in `src/lib/markdown.ts`: citation jumps, stable heading IDs, accessible tables, rejection of raw contributor HTML/images and a final allowlist sanitizer. This extends the native renderer rather than maintaining another Markdown parser. Numeric-cell classification is shared with the evidence table renderer.

Update relevant sources, evidence associations, data JSON, `content/release.json` and `CHANGELOG.md` together when changing a factual claim. The TypeScript validator shares the collection schema and checks citations, routes, publication flags and arithmetic; it does not independently verify truth. It is intentionally pinned to the 40-article release; expand its baseline deliberately for newly researched articles. `roadmap/` remains private build input and is never imported into public pages.

The four evidence tables use `content/data/*.json` and are downloadable without rounding stored inputs. Existing budget and road tables are replaced in place with the data-driven table rather than duplicated. The two other tables supplement the prose. Original citation URLs, including PDF `#page=` fragments, remain in the source panels.

## Corrections and publishing

Every article offers an editable, copyable/downloadable correction draft with article ID, version, original claim, source URL/locator and proposed correction. **Nothing is submitted or saved.** No contact destination was supplied. Configure an actual maintained email/issue workflow before adding submission functionality.

Deploy `dist/` to any static host, configure HTTPS and a real 404 response using `404.html`, and avoid SPA fallback rewrites for unpublished routes. `astro.config.ts`, `public/robots.txt` and the sitemap use `https://bepoliticallyaware.org`; update all three if the domain changes. Astro emits a hash-based CSP in production HTML. Deployment and DNS are not configured by this project.

Local checks prove schema consistency, structure, routes, citation matching and selected arithmetic, not remote source uptime, factual truth or independent editorial/legal approval. See `RESEARCH_NOTES.md` for the source pack’s access limitations.

## Design and implementation references

Skills used: brainstorming, frontend-design, agent-browser and web-design-guidelines. The presentation redesign follows the maintainer's approved layout/type/token specification. Earlier design references: [Linear Docs](https://linear.app/docs) for restrained navigation/search and [GOV.UK civic guidance](https://www.gov.uk/register-to-vote) for descriptive links and content hierarchy. No imagery or template UI is copied.

Authoritative implementation sources: [Astro routing](https://docs.astro.build/en/guides/routing/), [content collections](https://docs.astro.build/en/guides/content-collections/), [Markdown](https://docs.astro.build/en/guides/markdown-content/), [CSP configuration](https://docs.astro.build/en/reference/configuration-reference/#securitycsp), [Sätteri plugins](https://satteri.bruits.org/docs/plugins/), [plugin API](https://satteri.bruits.org/docs/plugin-api/), [hast-util-sanitize](https://github.com/syntax-tree/hast-util-sanitize), [MiniSearch](https://github.com/lucaong/minisearch), and [WAI modal dialog behavior](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

Native-renderer migration research: [Sätteri documentation/API drift issue #104](https://github.com/bruits/satteri/issues/104) and the [upstream node-cloning changeset](https://github.com/bruits/satteri/blob/main/.sampo/changesets/clone-tree-nodes.md). Sätteri 0.10.5's lazy tree nodes are passed directly to the sanitizer, which returns a new tree; no `structuredClone()` workaround or second renderer is needed. Evidence-table replacement uses the supported `htmlToHast()` fragment API rather than raw-HTML replacement nodes (see [#60](https://github.com/bruits/satteri/issues/60) and [#140](https://github.com/bruits/satteri/pull/140)).

Restyle references: the maintainer's local `preview.html`, [Astro processed scripts](https://docs.astro.build/en/guides/client-side-scripts/), [MDN native disclosures](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details), [MDN native dialogs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), and [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md). This is a local presentation change, not a diagnosed upstream regression; GitHub issue research was unnecessary.

Framework alignment references: [Astro configuration formats](https://docs.astro.build/en/guides/configuring-astro/) (both `.mjs` and `.ts` are supported), [current Astro release](https://docs.astro.build/en/upgrade-astro/), [Astro 7 migration guide](https://docs.astro.build/en/guides/upgrade-to/v7/), [Astro TypeScript utilities](https://docs.astro.build/en/guides/typescript/), [typed endpoints](https://docs.astro.build/en/guides/endpoints/), [Tailwind's Astro setup](https://tailwindcss.com/docs/installation/framework-guides/astro), [theme aliases](https://tailwindcss.com/docs/theme), and [omitting Preflight](https://tailwindcss.com/docs/preflight). The external `/theme.js` intentionally retains `is:inline` so it runs before first paint, as documented for public scripts.
