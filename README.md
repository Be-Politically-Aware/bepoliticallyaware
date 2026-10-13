# Be Politically Aware

A minimal, static Astro civic-education site for India. All 40 launch articles are supplied content, rendered from Markdown with citations, research-check dates and source limitations intact. Geist is self-hosted. No accounts, tracking, third-party embeds or server are required.

## Development

Use Node 22.12+ (or a newer supported Node release), Bun and Python 3:

```sh
bun install
bun run dev
```

Open http://localhost:4321. Build and check the production site:

```sh
bun run validate
bun run preview
```

`validate` runs the supplied Python consistency checks, Astro diagnostics, a static build, and Bun tests against that build. `bun test` requires a current `dist/` (run `bun run build` first).

## Reading and search

- `/` and `/in`: question-led introductions; seven public topic entry points and all hub indexes.
- Exact supplied article routes under `/in/`; six guided paths at `/in/paths`.
- `/in/reference/glossary`: all 46 terms, with an alphabetical index and explanatory links.
- `/sources`: document provenance and limitations. Each article has its own numbered, exact source locators.
- `/search`: full-text ranked search across published titles, summaries, headings and body text, with highlighted excerpts, prefix matching and typo tolerance for longer words. Queries are shareable through `?q=`.
- Cmd/Ctrl+K or `/`: opens search anywhere. `/` does not interrupt typing in inputs. Arrow keys navigate results, Enter opens one, Escape closes the dialog, Tab stays inside it, and focus returns on close. Clicking Search works on touch devices. Search requires JavaScript; article browsing does not.
- Theme follows the system until explicitly selected and then remembers the choice locally. No analytics storage is used.

## Content source of truth

**`content/articles.json` is canonical.** Its `body_markdown` fields are rendered at build time using Marked, with raw HTML rejected and output sanitised. Only `status === "ready" && publish === true` is included in routes, navigation, search and sitemap. `content/articles/*.md` are generated portable exports, not a second editable source. This deliberately uses JSON metadata + Markdown prose rather than a CMS or duplicate Astro collection.

After editing canonical content:

```sh
python3 scripts/export_markdown.py
bun run validate
```

Update relevant sources, evidence associations, data JSON, `content/release.json` and `CHANGELOG.md` together when changing a factual claim. The exporter does not independently verify truth. The validator is intentionally pinned to the 40-article release; expand its baseline deliberately for newly researched articles. `roadmap/` remains private build input and is never imported into public pages.

The four evidence tables use `content/data/*.json` and are downloadable without rounding stored inputs. Existing budget and road tables are replaced in place with the data-driven table rather than duplicated. The two other tables supplement the prose. Original citation URLs, including PDF `#page=` fragments, remain in the source panels.

## Corrections and publishing

Every article offers an editable, copyable/downloadable correction draft with article ID, version, original claim, source URL/locator and proposed correction. **Nothing is submitted or saved.** No contact destination was supplied. Configure an actual maintained email/issue workflow before adding submission functionality.

Deploy `dist/` to any static host, configure HTTPS and a real 404 response using `404.html`, and avoid SPA fallback rewrites for unpublished routes. `astro.config.mjs`, `public/robots.txt` and the sitemap use `https://bepoliticallyaware.org`; update all three if the domain changes. Astro emits a hash-based CSP in production HTML. Deployment and DNS are not configured by this project.

Local checks prove structure, routes, citation matching, export parity and selected arithmetic, not remote source uptime, factual truth or independent editorial/legal approval. See `RESEARCH_NOTES.md` for the source pack’s access limitations.

## Design and implementation references

Skills used: brainstorming, frontend-design and agent-browser. Design references: [Linear Docs](https://linear.app/docs) for restrained navigation/search and [GOV.UK civic guidance](https://www.gov.uk/register-to-vote) for descriptive links and content hierarchy. No imagery or template UI is copied.

Authoritative implementation sources: [Astro routing](https://docs.astro.build/en/guides/routing/), [Markdown](https://docs.astro.build/en/guides/markdown-content/), [CSP configuration](https://docs.astro.build/en/reference/configuration-reference/#securitycsp), [Marked renderer API](https://marked.js.org/using_pro), [sanitize-html](https://github.com/apostrophecms/apostrophe/tree/main/packages/sanitize-html), [MiniSearch](https://github.com/lucaong/minisearch), and [WAI modal dialog behavior](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). No upstream regression was diagnosed; issue-thread research was not needed.
