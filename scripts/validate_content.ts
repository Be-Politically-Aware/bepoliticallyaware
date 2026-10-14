/** Local contract and arithmetic checks, not proof of source truth or current law. */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { parseFrontmatter } from "astro/markdown";
import { articleSchema } from "../src/lib/article-schema";
import { dataSchema } from "../src/lib/data-schema";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const errors: string[] = [];
let checks = 0;

function require(condition: boolean, message: string) {
  checks++;
  if (!condition) errors.push(message);
}

function load<T>(relative: string): T {
  return JSON.parse(readFileSync(new URL(relative, root), "utf8")) as T;
}

function equal<T>(left: T[], right: T[]) {
  return (
    left.length === right.length && left.every((value, i) => value === right[i])
  );
}

function sameSet(left: Set<string>, right: Set<string>) {
  return (
    left.size === right.size && [...left].every((value) => right.has(value))
  );
}

function validate() {
  const articles = readdirSync(new URL("content/articles/", root))
    .filter((file) => file.endsWith(".md"))
    .sort()
    .flatMap((file) => {
      const { frontmatter, content } = parseFrontmatter(
        readFileSync(new URL(`content/articles/${file}`, root), "utf8"),
      );
      const parsed = articleSchema.safeParse(frontmatter);
      require(parsed.success, `${file}: invalid frontmatter${parsed.success ? "" : `: ${parsed.error.message}`}.`);
      if (!parsed.success) return [];
      require(file ===
        `${parsed.data.id}.md`, `${file}: filename differs from article ID.`);
      require(!/^#\s+/m.test(
        content,
      ), `${file}: body must not duplicate the page title.`);
      return [{ ...parsed.data, body_markdown: content }];
    });
  const sources = load<typeof import("../content/sources.json")>(
    "content/sources.json",
  );
  const nav = load<typeof import("../content/navigation.json")>(
    "content/navigation.json",
  );
  const docs = new Map(sources.documents.map((d) => [d.id, d]));
  const refs = new Map(sources.references.map((r) => [r.id, r]));
  const ids = new Set(articles.map((a) => a.id));
  const routes = new Set(articles.map((a) => a.route));
  require(articles.length === 64, "Expected 64 ready articles.");
  const assets = load<typeof import("../content/data-index.json")>(
    "content/data-index.json",
  ).map((item) => dataSchema.parse(load(item.path)));
  const dataIds = new Set(assets.map((asset) => asset.id));
  require(dataIds.size === 7, "Expected seven unique expansion data assets.");
  require(assets
    .filter((asset) => asset.asset_type === "official_statistics")
    .reduce(
      (sum, asset) =>
        sum +
        asset.tables.reduce((count, table) => count + table.rows.length, 0),
      0,
    ) === 327, "Expected 327 official statistical observations.");
  for (const asset of assets) {
    require(asset.synthetic ===
      (asset.asset_type ===
        "synthetic_teaching_example"), `${asset.id}: incorrect synthetic classification.`);
    require(asset.source_ref_ids.every((id) =>
      refs.has(id),
    ), `${asset.id}: unresolved data source.`);
    for (const table of asset.tables) {
      require(table.row_count ===
        table.rows.length, `${asset.id}/${table.id}: incorrect row count.`);
      require(!table.csv_path.includes("..") &&
        readFileSync(new URL(table.csv_path, root), "utf8").length >
          0, `${asset.id}/${table.id}: missing CSV.`);
      for (const row of table.rows) {
        const ref = refs.get(String(row.source_ref_id));
        require((asset.synthetic && row.source_ref_id === null) ||
          Boolean(
            ref && ref.url === row.source_url,
          ), `${asset.id}/${table.id}: invalid row source.`);
        require(table.columns.every(
          (column) => column in row,
        ), `${asset.id}/${table.id}: missing row field.`);
        if (asset.asset_type === "official_statistics")
          require(typeof row.value === "number" &&
            Number.isFinite(row.value) &&
            Boolean(
              row.unit,
            ), `${asset.id}/${table.id}: missing numeric value/unit.`);
      }
    }
  }
  require(ids.size === routes.size &&
    ids.size === articles.length, "Duplicate article ID or route.");
  require(sameSet(
    new Set(nav.hubs.flatMap((hub) => hub.article_ids)),
    ids,
  ), "Navigation differs from article set.");
  require(equal(
    articles
      .flatMap((a) => (a.launch_order === null ? [] : [a.launch_order]))
      .sort((a, b) => a - b),
    Array.from({ length: 32 }, (_, i) => i + 1),
  ), "Original 32 launch pages are not complete.");
  for (const a of articles) {
    const label = a.id;
    const body = a.body_markdown;
    require((a.data_ids ?? []).every((id) =>
      dataIds.has(id),
    ), `${label}: unknown data asset.`);
    if (a.content_sha256)
      require(createHash("sha256").update(body.trim()).digest("hex") ===
        a.content_sha256, `${label}: body hash mismatch.`);
    require(a.status === "ready" &&
      a.publish === true, `${label}: not publishable.`);
    require(a.country === "IN" &&
      a.language === "en", `${label}: invalid country/language.`);
    require(a.route.startsWith("/in/"), `${label}: missing country route.`);
    require(body.trim().split(/\s+/u).length >
      250, `${label}: missing or unexpectedly short finished body.`);
    require(!body.includes("{{") &&
      !body.includes("}}"), `${label}: unresolved citation token.`);
    require(!/\b(?:TODO|TBD|lorem ipsum)\b/i.test(
      body,
    ), `${label}: placeholder in article body.`);
    require(a.human_reviewed === false, `${label}: invented human review.`);
    require(Boolean(a.reader_task), `${label}: missing reader task.`);
    require(a.related_ids.every((id) =>
      ids.has(id),
    ), `${label}: related unpublished/unknown article.`);
    require(a.source_ref_ids.every((id) =>
      refs.has(id),
    ), `${label}: unknown source locator.`);
    require(equal(
      a.source_ref_ids,
      a.sources.map((s) => s.ref_id),
    ), `${label}: source order differs.`);
    const numbers = a.sources.map((s) => s.number);
    require(equal(
      numbers,
      numbers.map((_, i) => i + 1),
    ), `${label}: invalid source numbering.`);
    const citations = [...body.matchAll(/\[(\d+)\]\((https?:\/\/[^\s]+)\)/g)];
    const sourceMap = new Map(a.sources.map((s) => [String(s.number), s.url]));
    for (const [, number, url] of citations) {
      require(sourceMap.get(number!) ===
        url, `${label}: citation ${number} URL mismatch.`);
    }
    require(sameSet(
      new Set(citations.map((c) => c[1]!)),
      new Set(sourceMap.keys()),
    ), `${label}: missing or unreferenced source number.`);
    for (const [, destination] of body.matchAll(/\]\((\/in\/[^\s)]+)\)/g)) {
      require(routes.has(
        destination!,
      ), `${label}: unresolved internal link ${destination}.`);
    }
    if (a.quiz) {
      require(a.quiz.answer_index >= 0 &&
        a.quiz.answer_index <
          a.quiz.options.length, `${label}: invalid quiz answer.`);
    }
  }
  for (const d of docs.values()) {
    require(/^https:\/\/[^/?#]+/i.test(d.url), `Invalid source URL: ${d.id}.`);
    require(Boolean(d.access_scope), `Missing access scope: ${d.id}.`);
  }
  for (const r of refs.values()) {
    require(docs.has(r.document_id) &&
      Boolean(r.locator), `Invalid exact reference: ${r.id}.`);
  }
  for (const item of load<typeof import("../content/glossary.json")>(
    "content/glossary.json",
  )) {
    require(ids.has(item.article_id) &&
      routes.has(item.route), `Invalid glossary destination: ${item.term}.`);
    require(item.source_ref_ids.every((id) =>
      refs.has(id),
    ), `Unknown glossary source: ${item.term}.`);
  }
  for (const path of nav.reading_paths) {
    require(path.article_ids.every((id) =>
      ids.has(id),
    ), `Invalid reading path: ${path.id}.`);
  }
  for (const hub of nav.hubs) {
    require(hub.article_ids.every((id) =>
      ids.has(id),
    ), `Invalid hub: ${hub.id}.`);
  }
  const backlog = load<typeof import("../roadmap/backlog.json")>(
    "roadmap/backlog.json",
  ).pages;
  require(backlog.length ===
    117, "Expected 117 still-unwritten original briefs.");
  require(!backlog.some((b) =>
    ids.has(b.id),
  ), "Published and planned sets overlap.");
  require(backlog.every(
    (b) => b.publish === false && b.status === "planned",
  ), "Planned brief marked public.");
  const budget = load<
    typeof import("../content/data/union-budget-2026-27-expenditure.json")
  >("content/data/union-budget-2026-27-expenditure.json");
  const [total, revenue, capital] = budget.rows.map((r) => r.values);
  for (let i = 0; i < 4; i++) {
    require(revenue![i]! + capital![i]! ===
      total![i], `Budget column ${i}: total mismatch.`);
  }
  const growth = ((total![3]! - total![2]!) / total![2]!) * 100;
  require(Number(growth.toFixed(2)) ===
    7.7, "Budget growth does not round to 7.70%.");
  require(Math.abs(growth - budget.calculations[0]!.value) <
    1e-12, "Stored budget calculation differs.");
  const road = load<
    typeof import("../content/data/road-deaths-2024-parliament-answer.json")
  >("content/data/road-deaths-2024-parliament-answer.json");
  const values = road.observations.map((o) => o.value);
  require(equal(
    values,
    [177175, 175142, 162500],
  ), "Road data values differ from checked transcription.");
  require(values[0]! - values[1]! === road.calculations[0]!.value &&
    road.calculations[0]!.value === 2033, "Road difference mismatch.");
  const plfs = load<
    typeof import("../content/data/plfs-2025-annual-usual-status.json")
  >("content/data/plfs-2025-annual-usual-status.json");
  require(equal(
    plfs.indicators.map((i) => i.value),
    [59.3, 57.4, 3.1],
  ), "PLFS transcription mismatch.");
  require(plfs.age_group === "15 years and above", "PLFS age scope lost.");
  const adr = load<
    typeof import("../content/data/adr-2024-winning-candidate-disclosures.json")
  >("content/data/adr-2024-winning-candidate-disclosures.json");
  const share = (adr.numerator / adr.denominator) * 100;
  // Use ties-to-even rounding for whole percentages.
  const roundedShare =
    share % 1 === 0.5 ? Math.round(share / 2) * 2 : Math.round(share);
  require(roundedShare ===
    adr.reported_rounded_percentage, "ADR rounded share mismatch.");
  require(Math.abs(adr.computed_percentage - (251 / 543) * 100) <
    1e-12, "ADR computed share mismatch.");
  for (const passage of load<typeof import("../evidence/passage-ledger.json")>(
    "evidence/passage-ledger.json",
  ).passages) {
    require(ids.has(passage.article_id) &&
      passage.source_ref_ids.every((id) =>
        refs.has(id),
      ), `Unresolved evidence association: ${passage.id}.`);
  }
  const report = {
    passed: errors.length === 0,
    checks,
    articles: articles.length,
    original_launch_articles: 32,
    source_documents: docs.size,
    exact_source_locators: refs.size,
    errors,
    scope:
      "Markdown frontmatter schema, local structure, internal links, citation-reference consistency and selected arithmetic checks.",
    not_tested: [
      "Network availability of remote URLs",
      "Automated proof of factual truth",
      "Independent human or legal review",
      "Production frontend accessibility or deployment",
    ],
  };
  mkdirSync(new URL("checks/", root), { recursive: true });
  writeFileSync(
    new URL("checks/validation.json", root),
    JSON.stringify(report, null, 2) + "\n",
  );
  return report;
}

try {
  const report = validate();
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.passed ? 0 : 1;
} catch (error) {
  console.error(
    `Validation could not complete: ${error instanceof Error ? error.message : error}`,
  );
  process.exitCode = 2;
}
