# Be Politically Aware

A static civic-education website for India: understand public institutions, read evidence carefully, and ask better questions. Built with Astro, TypeScript, Tailwind CSS and Bun, with Markdown as the article source of truth.

The launch collection includes **40 articles, six reading paths, 46 glossary terms and four source-linked evidence tables**. The reading interface uses system fonts, sharp borders, light/dark themes and a mobile article index. No accounts, tracking, database or server-side application are required.

**Status:** implemented and locally validated, not deployed. The configured production URL is `https://bepoliticallyaware.org`. This is general civic education, not legal advice or a live-news/data service. Research-check dates do not imply continuous monitoring or independent human review.

## Quick start

Use **Node 24** (recorded in `.node-version`) and **Bun 1.4.0** (recorded in `package.json`). Astro requires Node 22.12+; CI uses Node 24. No environment variables, credentials or Python installation are needed to run the site.

```sh
git clone git@github.com:zxcodes/bepoliticallyaware.git
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

| Command                    | Purpose                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| `bun run dev`              | Development server with live updates                                 |
| `bun run check`            | Astro diagnostics/type generation, then standalone TypeScript checks |
| `bun run build`            | Type checks and static production build into `dist/`                 |
| `bun run preview`          | Serve the production build locally                                   |
| `bun run validate:content` | Frontmatter, citations, routes and selected arithmetic checks        |
| `bun test`                 | Regression tests; requires a current production build                |
| `bun run validate`         | Content checks, type checks, build and all tests                     |

GitHub Actions runs `bun install --frozen-lockfile` and `bun run validate` on pushes to `main` and pull requests. The workflow has read-only repository permissions and does **not** deploy.

The content validator writes `checks/validation.json`. Exit code **0** means passed, **1** means failed checks, and **2** means validation could not complete. The release baseline is deliberately fixed at 40 articles; extend it intentionally when publishing newly researched content.

Tests cover published routes, internal links/fragments, exact source locators, exclusion of planned briefs, evidence tables, search ranking and Markdown safety. Automated checks do not establish factual truth, remote-source availability, or independent editorial/legal approval. See [research notes](RESEARCH_NOTES.md) for source-access limitations.

## Repository map

```text
content/articles/       Canonical Markdown articles and YAML frontmatter
content/data/           Four evidence datasets, also emitted as downloadable JSON
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
- Only `status: "ready"` **and** `publish: true` appear in pages, navigation, search and sitemap. The 141 briefs in `roadmap/` remain unpublished.
- When changing a factual claim, update its dependent source notes, evidence/data, article version, release metadata and [change history](CHANGELOG.md) together.
- Run `bun run validate`, then inspect the affected article, citation jumps and tables in the production preview. Check mobile and keyboard behavior when changing presentation.

Reading time, related article titles/routes and full-text search are derived at build time. Evidence tables use the stored JSON inputs without changing their precision; the budget and road tables replace the corresponding prose tables rather than appearing twice.

## Reading experience

- `/` and `/in`: question-led introductions; seven topic entry points and hub indexes.
- `/in/paths`: six guided reading paths. `/in/reference/glossary`: all 46 terms.
- `/sources`: provenance and limitations; articles also have exact numbered source panels.
- `/search`: full-text search with shareable `?q=` queries, highlighted excerpts, prefix matching and typo tolerance.
- **Cmd/Ctrl+K** or **/** opens search; arrow keys navigate, Enter opens a result and Escape closes it. The slash shortcut does not interrupt typing.
- The article index's filter searches titles/summaries only; full-text search is separate.
- Reading, source panels and the native mobile index work without JavaScript. Search and optional filter/theme/copy controls require JavaScript.
- Light is the default; an explicit theme choice is remembered locally. Without JavaScript, the system colour preference applies. Print uses a light, full-width layout.

Every article offers an editable correction draft to copy or download. **Nothing is submitted or saved.** A maintained submission destination must be configured before adding a real reporting workflow.

## Implementation conventions

Astro 7 uses a typed `astro.config.ts`, strict TypeScript and typed route boundaries. Conflicting prerendered routes fail the build. `astro check` runs before `tsc` so a fresh checkout receives generated collection types. Keep TypeScript within the Astro checker's supported range.

Tailwind 4 uses `@tailwindcss/vite`; Preflight is intentionally omitted to preserve native disclosures and the reading site's reset. Theme utilities alias existing CSS tokens. Keep content-driven prose, tables and print behavior in semantic CSS. Prettier is configured for Astro; `.editorconfig` defines UTF-8, LF and two-space indentation. Canonical article files are excluded from blanket formatting to avoid rewriting supplied prose.

The native Sätteri Markdown pipeline extends Astro with citation jumps, stable heading IDs and accessible tables. It rejects raw contributor HTML/images and applies a final allowlist sanitizer. Production HTML includes Astro's hash-based CSP; no unrestricted raw HTML, inline event handlers or third-party embeds are needed.

Read [AGENTS.md](AGENTS.md) and the [build specification](implementation/BUILD_SPEC.md) before changing code or content. This is a private project; no project redistribution license has been selected. Source documents and dependencies retain their respective terms.

## Deployment

1. Run `bun install --frozen-lockfile` and `bun run validate`.
2. Publish **only `dist/`** to a static host, with HTTPS and `404.html` served as a genuine 404 response. Do not deploy the repository root or use a catch-all SPA rewrite.
3. If the domain changes, update `astro.config.ts`, `public/robots.txt` and the sitemap origin in `src/pages/sitemap.xml.ts` together.
4. Check production routes, citation fragments, search, CSP console output and mobile behavior on the actual host.

Hosting, DNS, scheduled source checks and correction submissions are **not configured**. Pushing this repository runs validation, not a release.

## Technical references

[Astro content collections](https://docs.astro.build/en/guides/content-collections/) · [Astro CLI/type generation](https://docs.astro.build/en/reference/cli-reference/) · [Tailwind's Astro setup](https://tailwindcss.com/docs/installation/framework-guides/astro) · [Sätteri plugins](https://satteri.bruits.org/docs/plugins/) · [hast-util-sanitize](https://github.com/syntax-tree/hast-util-sanitize).

Earlier native-renderer research: Sätteri [API documentation issue #104](https://github.com/bruits/satteri/issues/104) and [HTML-to-HAST support #60](https://github.com/bruits/satteri/issues/60). The sanitizer returns a new tree directly; evidence replacement uses `htmlToHast()` rather than raw replacement nodes.
