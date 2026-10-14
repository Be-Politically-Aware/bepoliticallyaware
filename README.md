# Be Politically Aware

A static civic-education website for India: understand public institutions, read evidence carefully, and ask better questions. Built with Astro, TypeScript, Tailwind CSS and Bun, with Markdown as the article source of truth.

The collection includes **64 articles, 10 reading paths, 73 glossary terms and 11 source-linked data assets** after expansion v3. The reading interface uses system fonts, sharp borders, light/dark themes and a mobile article index. No accounts, tracking, database or server-side application are required.

**Status:** implemented and locally validated, not deployed. The configured production URL is `https://bepoliticallyaware.org`. This is general civic education, not legal advice or a live-news/data service. Research-check dates do not imply continuous monitoring or independent human review.

## Quick start

Use **Node 24** (recorded in `.node-version`) and **Bun 1.4.0** (recorded in `package.json`). Astro requires Node 22.12+; CI uses Node 24. No environment variables, credentials or Python installation are needed to run the site.

```sh
git clone git@github.com:Be-Politically-Aware/bepoliticallyaware.git
cd bepoliticallyaware
bun install --frozen-lockfile
bun run dev
```

Open **http://127.0.0.1:4321**. To validate and preview the production build:

```sh
bun run validate
bun run preview
```

The development and preview servers bind to localhost. If port 4321 is occupied, use the URL printed by Astro. `preview` serves the existing `dist/`; it does not build or deploy.

## Commands and checks

| Command                      | Purpose                                                              |
| ---------------------------- | -------------------------------------------------------------------- |
| `bun run dev`                | Development server with live updates                                 |
| `bun run check`              | Astro diagnostics/type generation, then standalone TypeScript checks |
| `bun run build`              | Type checks and static production build into `dist/`                 |
| `bun run preview`            | Serve the production build locally                                   |
| `bun run preview:cloudflare` | Build and serve locally using Wrangler's static-assets runtime       |
| `bun run lint`               | Oxlint correctness checks; warnings fail validation                  |
| `bun run lint:fix`           | Apply safe Oxlint fixes                                              |
| `bun run format`             | Format supported code/config/docs with Oxfmt, including Astro        |
| `bun run format:check`       | Check formatting without changing files                              |
| `bun run validate:content`   | Frontmatter, citations, routes and selected arithmetic checks        |
| `bun test`                   | Regression tests; requires a current production build                |
| `bun run validate`           | Lint, formatting, content checks, type checks, build and all tests   |
| `bun run deploy`             | Validate, rebuild and deploy static assets to Cloudflare             |

GitHub Actions runs `bun install --frozen-lockfile` and `bun run validate` on pushes to `main` and pull requests. The workflow has read-only repository permissions and does **not** deploy.

The content validator writes `checks/validation.json`. Exit code **0** means passed, **1** means failed checks, and **2** means validation could not complete. The release baseline is deliberately fixed at 64 articles and 117 unpublished briefs; extend it intentionally when publishing newly researched content.

Tests cover published routes, internal links/fragments, exact source locators, exclusion of planned briefs, evidence tables, search ranking and Markdown safety. Automated checks do not establish factual truth, remote-source availability, or independent editorial/legal approval. See [research notes](RESEARCH_NOTES.md) for source-access limitations.

## Repository map

```text
content/articles/       Canonical Markdown articles and YAML frontmatter
content/data/           11 evidence/data assets, also emitted as downloadable JSON
content/                Navigation, glossary, site copy and source directory
src/content.config.ts   Native Astro collection and shared schema
src/components/         Article, index, reading paths/home and search components
src/layouts/            Shared page shell, metadata and theme controls
src/lib/                Content queries, Markdown plugins, tables and search
src/pages/              Static routes, search index, sitemap and data endpoints
src/styles/             Design tokens, Tailwind aliases, prose and print styles
public/                 Favicon, robots.txt and the first-paint theme script
scripts/                TypeScript content validator
tests/                  Built-site and validator regression tests
evidence/               Research passage associations and service links
roadmap/                Unpublished briefs; never imported by public pages
implementation/         Build specification
.github/workflows/      Validation-only CI
```

## Editing content

**Edit `content/articles/*.md` directly.** Each file contains metadata, reader tasks, related IDs and source notes in YAML frontmatter, followed by the article body. Astro's native `glob()` collection validates frontmatter with the shared Zod schema; pages use `getCollection()` and `render()` with `<Content />`. There is no exporter, duplicate article JSON or hand-maintained search index.

- Keep the filename equal to the frontmatter `id`, and preserve the supplied `/in/` route.
- Quote dates, e.g. `research_checked_at: "2026-10-13"`.
- Keep the page title in frontmatter, not as a second `# Heading` in the body.
- Cite sources using `[1](https://original-source-url)` and match each number/URL to its frontmatter source entry. Preserve exact locators, PDF page fragments, editions, reference periods and limitations.
- Do not append task, related or source sections to the body; the article template renders them.
- Only `status: "ready"` **and** `publish: true` appear in pages, navigation, search and sitemap. The 117 briefs in `roadmap/` remain unpublished.
- When changing a factual claim, update its dependent source notes, evidence/data, article version, release metadata and [change history](CHANGELOG.md) together.
- Run `bun run validate`, then inspect the affected article, citation jumps and tables in the production preview. Check mobile and keyboard behavior when changing presentation.

Reading time, related article titles/routes and full-text search are derived at build time. Evidence tables use the stored JSON inputs without changing their precision; the budget and road tables replace the corresponding prose tables rather than appearing twice.

Expansion v3 was mapped additively into this native Markdown structure, not imported over a v2 JSON collection. The import preserved the original 40 articles and their research dates; subsequent targeted audit corrections are recorded in the change history without refreshing those dates. Additional glossary definitions are rendered from the merged glossary registry. New article frontmatter can include `data_ids` and `release_batch`. Imported body hashes must be updated with intentional prose corrections.

The seven new assets retain their `tables[]` JSON and 11 CSV files. Their panels explicitly distinguish official statistics, reference tables and hypothetical teaching inputs. Units, estimate stages, reference periods, GDP-series variants and row-level source details are preserved; missing values are not replaced with zero. JSON and CSV downloads are generated by static endpoints. See the [v3 data dictionary](implementation/EXPANSION_V3_DATA_DICTIONARY.md) and [research notes](evidence/expansion-v3-research-notes.md) for interpretation limits. Release-specific research dates do not redate older articles.

## Reading experience

- `/` and `/in`: question-led introductions; seven topic entry points and hub indexes.
- `/in/paths`: 10 guided reading paths. `/in/reference/glossary`: all 73 terms.
- `/sources`: provenance and limitations; articles also have exact numbered source panels.
- `/search`: full-text search with shareable `?q=` queries, highlighted excerpts, prefix matching and typo tolerance.
- **Cmd/Ctrl+K** or **/** opens search; arrow keys navigate, Enter opens a result and Escape closes it. The slash shortcut does not interrupt typing.
- The article index's filter searches titles/summaries only; full-text search is separate.
- Reading, source panels and the native mobile index work without JavaScript. Search and optional filter/theme/copy controls require JavaScript.
- Light is the default; an explicit theme choice is remembered locally. Without JavaScript, the system colour preference applies. Print uses a light, full-width layout.

Every article offers an editable correction draft to copy or download. **Nothing is submitted or saved.** A maintained submission destination must be configured before adding a real reporting workflow.

## SEO and social images

`src/lib/seo.ts` shares published page titles, descriptions and routes between the layout, sitemap and social-image endpoint. Every indexable page has an absolute canonical URL, Open Graph metadata, a Twitter large-image card and JSON-LD for the website, page and breadcrumbs. Article schema includes its headline and original source links; research-check dates are deliberately not presented as publication/modification dates, and author identities are not invented. Search and 404 stay `noindex` and are excluded from the sitemap.

`src/pages/og/[...route].png.ts` generates a **1200×630 PNG per indexable page** during the normal Astro build, using Satori and Resvg like the portfolio implementation. The homepage image is `/og/index.png`; an article such as `/in/start/why-care` uses `/og/in/start/why-care.png`. Edit `src/lib/og-image.ts` to change the dark card design. The local Geist font and its OFL license live in `src/assets/fonts/` and are used only at build time; page typography remains system-only. No remote image service, browser font download or runtime image server is required.

Built-site tests verify metadata, sitemap coverage, every linked PNG's dimensions, breadcrumbs and JSON-LD CSP hashes. Generated files live in `dist/`, not version control. Search-engine indexing and social-platform previews can only be checked after deployment; structured data does not guarantee rich results. Submit the deployed sitemap to your own Search Console account when launching.

## Implementation conventions

Astro 7 uses a typed `astro.config.ts`, strict TypeScript and typed route boundaries. Conflicting prerendered routes fail the build. `astro check` runs before `tsc` so a fresh checkout receives generated collection types. Keep TypeScript within the Astro checker's supported range.

Tailwind 4 uses `@tailwindcss/vite`; Preflight is intentionally omitted to preserve native disclosures and the reading site's reset. Theme utilities alias existing CSS tokens. Keep content-driven prose, tables and print behavior in semantic CSS.

Oxlint and Oxfmt are the project's lint/format tools, configured in `.oxlintrc.json` and `.oxfmtrc.json`. Both run in local validation and CI. Oxfmt's Astro support is enabled with `astro: true` and the explicit `@astrojs/compiler-rs` peer dependency. There is no separate Prettier dependency or configuration; Oxfmt 0.73 bundles a Prettier-based Astro printer internally. Oxlint checks supported JavaScript/TypeScript and Astro script regions, not Astro templates; `astro check` remains required.

`.editorconfig` defines UTF-8, LF and two-space indentation. Canonical/imported content, evidence, roadmap and implementation handoffs are excluded from blanket formatting to preserve prose, hashes, CSV line endings and statistical metadata. Generated build output, validation reports and Wrangler state are also excluded. Intentional content edits still require `bun run validate`.

The native Sätteri Markdown pipeline extends Astro with citation jumps, stable heading IDs and accessible tables. It rejects raw contributor HTML/images and applies a final allowlist sanitizer. Production HTML includes Astro's hash-based CSP; no unrestricted raw HTML, inline event handlers or third-party embeds are needed.

Read [AGENTS.md](AGENTS.md) and the [build specification](implementation/BUILD_SPEC.md) before changing code or content. This is a private project; no project redistribution license has been selected. Source documents and dependencies retain their respective terms.

## Deployment

`wrangler.jsonc` is the Cloudflare Workers Static Assets configuration. It serves **only `dist/`**, with no Worker script, server adapter, database or runtime bindings. The hostname `bepoliticallyaware.org` is declared as a Custom Domain (`custom_domain: true`), not a wildcard origin route. Public `workers.dev` and preview URLs are disabled. HTML URLs omit trailing slashes to match the canonical routes; missing URLs serve `404.html` with an actual 404 status, not an SPA fallback.

The compatibility date is `2026-10-13`, the newest date supported by Wrangler 4.150.0's bundled local runtime. Advance it after upgrading and testing; setting a date newer than the bundled runtime can prevent local startup ([upstream explanation](https://github.com/cloudflare/workers-sdk/issues/14942)).

For a local Cloudflare preview (no account or deployment required):

```sh
bun run preview:cloudflare
```

To inspect the deployment without uploading assets or changing DNS:

```sh
bunx wrangler deploy --dry-run
```

Wrangler's custom build runs `bun run build` before preview/deployment so it cannot silently deploy stale output. To publish, authenticate deliberately to the correct Cloudflare account with `bunx wrangler login`, then run `bun run deploy`. That command validates the site before deploying. Deployment requires ownership of an active Cloudflare zone for `bepoliticallyaware.org`; Cloudflare then creates the Custom Domain's DNS record and certificate. Resolve any conflicting hostname records before publishing. This configuration alone does not verify zone ownership, activate the domain or deploy anything. `www` is not configured; add a Cloudflare redirect separately if required.

If the domain changes, update `wrangler.jsonc`, `astro.config.ts`, `public/robots.txt` and `content/site-copy.json` together. Canonical URLs, the sitemap and social-image URLs derive their origin from Astro's site configuration; the image footer uses the domain in site copy. After deployment, check production routes, citation fragments, search, CSP console output and mobile behavior on the actual host.

Wrangler state and local `.dev.vars` secrets are ignored; do not put credentials in the config. Scheduled source checks and correction submissions are not configured. Pushing this repository runs validation, **not deployment**.

## Technical references

[Astro content collections](https://docs.astro.build/en/guides/content-collections/) · [Astro CLI/type generation](https://docs.astro.build/en/reference/cli-reference/) · [Tailwind's Astro setup](https://tailwindcss.com/docs/installation/framework-guides/astro) · [Sätteri plugins](https://satteri.bruits.org/docs/plugins/) · [hast-util-sanitize](https://github.com/syntax-tree/hast-util-sanitize).

Tooling references: [Oxlint configuration](https://oxc.rs/docs/guide/usage/linter/config.html), [Oxfmt configuration](https://oxc.rs/docs/guide/usage/formatter/config.html), [Oxfmt 0.73 Astro support](https://github.com/oxc-project/oxc/pull/27386), [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/), [SSG routing and 404s](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/), and [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/). The compatibility website's older Astro caveat links [general plugin support #15665](https://github.com/oxc-project/oxc/issues/15665); the installed Oxfmt release already includes the dedicated Astro integration.

Earlier native-renderer research: Sätteri [API documentation issue #104](https://github.com/bruits/satteri/issues/104) and [HTML-to-HAST support #60](https://github.com/bruits/satteri/issues/60). The sanitizer returns a new tree directly; evidence replacement uses `htmlToHast()` rather than raw replacement nodes.
