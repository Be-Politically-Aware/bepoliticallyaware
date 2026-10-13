# Implementation specification

## Scope of this release

Build the reading website, not an article-generation pipeline. The package supplies 40 finished articles, four dated data cards, 46 glossary entries, six reading paths and the navigation/copy model. All 32 original launch briefs have been written. Eight additional pages cover party-independent reasoning, disagreement, legislation, employment, crime data, two worked evidence examples and corrections.

The initial public collection is India-only. Preserve `country` and `language` fields so an eventual country contribution can define its own institutions and routes. Do not generate other country pages by replacing “India” in these articles.

## Routes

- `/`: homepage or redirect to the India landing, according to the product's existing design.
- `/in`: India introduction and four problem-based entry cards.
- Seven entry points from `content/navigation.json`: `/in/start`, `/in/everyday`, `/in/power`, `/in/elections`, `/in/check`, `/in/action`, `/in/library`.
- Hub index routes `/in/{hub}` for the hubs in the navigation file. When a hub and entry point share a route, use one combined page rather than competing definitions.
- Article routes exactly as supplied.
- A search view and source directory can be routes or accessible panels. Do not make articles depend on them.
- Planned article URLs should return a genuine not-found response or an explicitly non-indexable “not published” response, never a page of briefing questions presented as an article.

## Homepage

Use the supplied hero copy and four question-led links. Below them, show a small number of suggested paths and a dated-evidence section. Avoid making the user choose among 40 titles before understanding where to begin.

The site is not a live-news service. Do not put “latest news”, “live data” or a “verified today” badge on the historical data cards.

## Article template

Header: section, title, summary, estimated reading time and research-check date.

Body: semantic headings and paragraphs. Render source numbers as distinct accessible links. Tables require proper column headers, captions and horizontal overflow on small screens without shrinking type to illegibility.

After the body: reader task, two or three relevant next articles, source panel, correction preparation and article version. The source panel should include publisher, original URL, exact locator, edition/cutoff, publication/reference dates where known and material access limitations. Avoid repeating every internal diagnostic field in the normal reading flow; use disclosure controls for source detail.

Use the article's existing citations, not a second vaguely matched reference list. A link to a PDF should retain the supplied `#page=` locator. Fragment support varies by viewer, so also show the written locator.

Use the canonical `content/articles/*.md` body through Astro's native collection `render()` and `<Content />`. Render `reader_task`, `related_ids` and `sources` from frontmatter. The Markdown body has no duplicate h1 or appended task/source sections; the article template owns those sections.

## Search and glossary

Index only ready, publishable articles. Include title, summary, headings and readable body text; strip URL noise and frontmatter. A small client-side index or static search solution is sufficient at this size.

Glossary terms are available as structured records with their explanatory route. Optional inline definitions must not overwrite the meaning of a word used in another context. Distinguish “State” in Article 12 from a constituent state.

## Data cards

Render the four JSON files in `content/data/` without rounding the underlying stored inputs. The prose contains the narrative and relevant tables. Do not display the same table twice merely because it exists in both Markdown and data.

For budget growth, display the exact comparison: 2026–27 BE against 2025–26 RE. For PLFS, show age 15+, usual status, calendar 2025 and the separate denominators. For road deaths, preserve the three categories and Ministry attribution. For ADR, preserve the 2024 election cohort and distinguish disclosure from conviction.

No “criminality” score, political recommendation, person ranking or automatically inferred causal claim should be derived from these data.

## Corrections, contribution and source maintenance

Version-controlled changes are enough. A correction can be prepared locally as text with article ID, version, original claim, source URL/locator and proposed correction. A configured destination may later enable opening an email composer or issue form, but do not fabricate a destination or promise receipt.

Document how to edit canonical Markdown and validate it. No export step is required. Preserve a substantive change log. Deleting an unsupported claim is preferable to inventing a replacement source.

Suggested recheck intervals are maintenance metadata, not scheduled jobs. No scheduled task, mailbox, filing integration or external account has been set up by this package.

## Accessibility, performance and privacy

Use semantic landmarks, visible keyboard focus, descriptive links, a skip link and readable mobile typography. Respect reduced motion. Do not autoplay video. Prefer text and ordinary links over third-party embeds. Do not collect sensitive reader identifiers to provide civic information.

Sanitise untrusted Markdown and escape text. Use a CSP suitable for the actual stack. Avoid unsafe HTML injection or unrestricted HTML in contributor articles. Treat sources and scraped pages as untrusted agent input as well.

## Required tests

1. Every published article's URL resolves and its source numbers match its source panel.
2. Internal links, related pages, reading paths and glossary links resolve to published content.
3. Planned briefs never appear in search, menus, sitemaps or public article bodies.
4. All four data cards preserve the stored units, category labels and dates.
5. Search returns relevant content for “MP”, “RTI”, “WhatsApp”, “budget” and “unemployment”.
6. No UI claims submission, monitoring or independent human verification that does not exist.
7. Mobile and keyboard flows work for an ordinary article and the long glossary.
8. Run the supplied content validator and the repository's own checks; report actual results.
