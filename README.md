# Be Politically Aware

Understand public institutions, check political claims, and ask better questions about the decisions that affect your life.

**[bepoliticallyaware.org](https://bepoliticallyaware.org)** — civic education for India, with 64 sourced articles, 10 reading paths, 73 glossary terms and 11 source-linked data assets. Includes search, light/dark mode and downloadable data. No accounts or tracking.

This is not legal advice or a live-news service. Research-check dates are not guarantees of current law or independent human review.

## Run locally

Use Node 24 and Bun 1.4.0.

```sh
git clone https://github.com/Be-Politically-Aware/bepoliticallyaware.git
cd bepoliticallyaware
bun install --frozen-lockfile
bun run dev
```

Open the URL Astro prints, usually **http://localhost:4321**. The dev server also allows local-network access.

## Edit content

Articles live in `content/articles/*.md`, with metadata and source notes in frontmatter. Edit them directly; pages and the search index are generated from these files at build time.

- Preserve routes, citations, dates, units and source limitations.
- When correcting a claim, update its supporting sources/data and [change history](CHANGELOG.md) together.
- Unfinished briefs in `roadmap/` are not published.

See [AGENTS.md](AGENTS.md) for contribution rules and [research notes](RESEARCH_NOTES.md) for review limits. Each article offers a correction draft to copy or download; the website does not submit it anywhere.

## Check your changes

```sh
bun run validate
```

Runs lint, formatting, content checks, type checks, a production build and all tests. GitHub Actions runs the same validation on pushes to `main` and pull requests.

Other useful commands:

| Command                      | Purpose                          |
| ---------------------------- | -------------------------------- |
| `bun run format`             | Format code and docs with Oxfmt  |
| `bun run build`              | Build the static site in `dist/` |
| `bun run preview`            | Preview an existing build        |
| `bun run preview:cloudflare` | Build and preview with Wrangler  |

Run builds, validation and deployment one at a time: another build can clear `dist/` while tests are reading it.

## Stack and deployment

Astro, Markdown content collections, TypeScript and Tailwind CSS. Oxlint and Oxfmt handle linting and formatting. Search, SEO metadata, the sitemap and social images are generated at build time; no database or application server is needed.

Hosted on Cloudflare Workers Static Assets. `wrangler.jsonc` configures the custom domain, `bepoliticallyaware.org`. To publish an update from the correct Cloudflare account:

```sh
bunx wrangler login
bun run deploy
```

Deployment validates, builds and publishes the site. **Pushing to GitHub does not deploy.**

## License

The repository is public, but no project redistribution license has been selected. Source documents and dependencies retain their own terms.
