import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { load } from "cheerio";
import { parseFrontmatter } from "astro/markdown";
import { createSatteriMarkdownProcessor } from "@astrojs/markdown-satteri";
import { articleSchema } from "../src/lib/article-schema";
import navigation from "../content/navigation.json";
import glossary from "../content/glossary.json";
import backlog from "../roadmap/backlog.json";
import {
  readingMarkdownPlugins,
  rejectContributorHtml,
} from "../src/lib/markdown";
import { evidence, evidenceTable } from "../src/lib/evidence";
import { createSearch, type SearchEntry } from "../src/lib/search";

const articles = readdirSync("content/articles")
  .filter((file) => file.endsWith(".md"))
  .map((file) =>
    articleSchema.parse(
      parseFrontmatter(readFileSync(join("content/articles", file), "utf8"))
        .frontmatter,
    ),
  )
  .filter((article) => article.status === "ready" && article.publish);
const sections = [...navigation.primary, ...navigation.hubs];
const paths = navigation.reading_paths.map((path) => ({
  ...path,
  route: `/in/paths/${path.id}`,
}));
const processor = await createSatteriMarkdownProcessor({
  syntaxHighlight: false,
  features: { smartPunctuation: false, rawHtml: false },
  mdastPlugins: [rejectContributorHtml],
  hastPlugins: [readingMarkdownPlugins],
});

const fileFor = (route: string) =>
  join("dist", route, route.includes(".") ? "" : "index.html");
const page = (route: string) => load(readFileSync(fileFor(route), "utf8"));
const publicRoutes = [
  "/",
  "/in",
  "/in/paths",
  "/sources",
  "/search",
  ...articles.map((a) => a.route),
  ...sections.map((s) => s.route),
  ...paths.map((p) => p.route),
];

describe("built reading website", () => {
  test("indexable pages have canonical metadata, static social cards and truthful structured data", () => {
    const origin = "https://bepoliticallyaware.org";
    const indexable = [...new Set(publicRoutes)].filter(
      (route) => route !== "/search",
    );
    const sitemap = load(readFileSync("dist/sitemap.xml", "utf8"), {
      xmlMode: true,
    });
    const urls = sitemap("loc")
      .map((_, el) => sitemap(el).text())
      .get();
    expect(urls.sort()).toEqual(
      indexable.map((route) => `${origin}${route}`).sort(),
    );
    expect(new Set(urls).size).toBe(urls.length);
    const descriptions = new Set<string>();
    for (const route of indexable) {
      const $ = page(route);
      const canonical = `${origin}${route}`;
      expect($('link[rel="canonical"]').length).toBe(1);
      expect($('link[rel="canonical"]').attr("href")).toBe(canonical);
      expect($('meta[property="og:url"]').attr("content")).toBe(canonical);
      expect($('meta[name="robots"]').length).toBe(0);
      const description = $('meta[name="description"]').attr("content")!;
      expect(description.length).toBeGreaterThan(20);
      descriptions.add(description);
      expect($('meta[property="og:description"]').attr("content")).toBe(
        description,
      );
      expect($('meta[name="twitter:description"]').attr("content")).toBe(
        description,
      );
      expect($('meta[name="twitter:card"]').attr("content")).toBe(
        "summary_large_image",
      );
      const image = $('meta[property="og:image"]').attr("content")!;
      expect(image).toBe(
        `${origin}/og/${route === "/" ? "index" : route.slice(1)}.png`,
      );
      expect($('meta[name="twitter:image"]').attr("content")).toBe(image);
      expect(
        $('meta[property="og:image:alt"]').attr("content")!.length,
      ).toBeGreaterThan(10);
      const png = readFileSync(join("dist", new URL(image).pathname));
      expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
      const scripts = $('script[type="application/ld+json"]');
      expect(scripts.length).toBe(1);
      const json = scripts.text();
      const graph = JSON.parse(json)["@graph"];
      const webpage = graph.find(
        (item: { "@type": string }) => item["@type"] === "WebPage",
      );
      expect(webpage.url).toBe(canonical);
      const crumb = graph.find(
        (item: { "@type": string }) => item["@type"] === "BreadcrumbList",
      );
      const items = crumb.itemListElement;
      expect(items.at(-1).item).toBe(canonical);
      expect(
        new Set(items.map((item: { item: string }) => item.item)).size,
      ).toBe(items.length);
      const hash = createHash("sha256").update(json).digest("base64");
      expect(
        $('meta[http-equiv="content-security-policy"]').attr("content"),
      ).toContain(`'sha256-${hash}'`);
      const article = articles.find((article) => article.route === route);
      expect($('meta[property="og:type"]').attr("content")).toBe(
        article ? "article" : "website",
      );
      if (article) {
        expect(description).toBe(article.summary);
        const schema = graph.find(
          (item: { "@type": string }) => item["@type"] === "Article",
        );
        expect(schema.headline).toBe(article.title);
        expect(schema.citation).toEqual(
          article.sources.map((source) => source.url),
        );
        for (const field of ["author", "datePublished", "dateModified"])
          expect(schema[field]).toBeUndefined();
      }
    }
    expect(descriptions.size).toBe(indexable.length);
    for (const route of ["/search", "/404.html"]) {
      const $ = page(route);
      expect($('meta[name="robots"]').attr("content")).toBe("noindex");
      expect($('script[type="application/ld+json"]').length).toBe(0);
    }
    const breadcrumb = JSON.parse(
      page("/in/money/read-a-budget")(
        'script[type="application/ld+json"]',
      ).text(),
    )["@graph"].find(
      (item: { "@type": string }) => item["@type"] === "BreadcrumbList",
    );
    expect(
      breadcrumb.itemListElement.map(
        (item: { item: string }) => new URL(item.item).pathname,
      ),
    ).toEqual([
      "/",
      "/in",
      "/in/library",
      "/in/money",
      "/in/money/read-a-budget",
    ]);
  });

  test("all published routes, citations and exact source locators are present", () => {
    expect(articles).toHaveLength(64);
    for (const route of publicRoutes)
      expect(existsSync(fileFor(route))).toBe(true);
    for (const article of articles) {
      const $ = page(article.route);
      expect($("h1").text()).toBe(article.title);
      expect($("time").attr("datetime")).toBe(article.research_checked_at);
      expect($("#sources > ol > li").length).toBe(article.sources.length);
      for (const source of article.sources) {
        const panel = $(`#source-${source.number}`);
        expect(panel.find("a").attr("href")).toBe(source.url);
        expect(panel.text()).toContain(source.locator);
        source.limitations.forEach((limit) =>
          expect(panel.text()).toContain(limit),
        );
        expect(
          $(`.citation[href="#source-${source.number}"]`).length,
        ).toBeGreaterThan(0);
      }
      expect($("#correction-draft").text()).toContain(
        `Version: ${article.version}`,
      );
      expect($(".correction summary").text()).toBe("Prepare a correction");
    }
  });

  test("every internal link and fragment resolves, including glossary and reading paths", () => {
    let checked = 0;
    for (const route of publicRoutes) {
      const $ = page(route);
      $("a[href]").each((_, element) => {
        const href = $(element).attr("href")!;
        if (!(href.startsWith("/") || href.startsWith("#"))) return;
        const url = new URL(href, `https://bepoliticallyaware.org${route}`);
        const file = fileFor(url.pathname);
        expect(existsSync(file)).toBe(true);
        if (url.hash) {
          const destination = page(url.pathname);
          expect(
            destination("[id]")
              .toArray()
              .some(
                (el) =>
                  destination(el).attr("id") ===
                  decodeURIComponent(url.hash.slice(1)),
              ),
          ).toBe(true);
        }
        checked++;
      });
    }
    expect(checked).toBeGreaterThan(1000);
    const $ = page("/in/reference/glossary");
    expect($(".prose h2").length).toBe(glossary.length);
    for (const term of glossary)
      expect($(".prose").text()).toContain(term.definition);
  });

  test("unpublished briefs do not leak into pages, search or sitemap", () => {
    const index = readFileSync("dist/search-index.json", "utf8");
    const sitemap = readFileSync("dist/sitemap.xml", "utf8");
    for (const brief of backlog.pages) {
      expect(existsSync(fileFor(brief.route))).toBe(false);
      expect(index).not.toContain(brief.route);
      expect(sitemap).not.toContain(
        `<loc>https://bepoliticallyaware.org${brief.route}</loc>`,
      );
      for (const route of publicRoutes)
        expect(readFileSync(fileFor(route), "utf8")).not.toContain(
          `href="${brief.route}"`,
        );
    }
  });

  test("evidence tables preserve numerical inputs, categories, dates and accessible headings", () => {
    const cases = [
      [
        "/in/dossiers/union-budget-2026",
        [
          "46,52,867",
          "49,64,842",
          "53,47,315",
          "2026–27 BE",
          "2025–26 RE",
          "₹ crore",
        ],
      ],
      [
        "/in/dossiers/road-deaths-2024",
        [
          "1,77,175",
          "1,75,142",
          "1,62,500",
          "Deaths due to negligence relating to road accidents",
          "2024",
        ],
      ],
      [
        "/in/everyday/jobs-and-wages",
        [
          "59.3",
          "57.4",
          "3.1",
          "Labour force aged 15+",
          "January–December 2025",
          "principal plus subsidiary",
        ],
      ],
      [
        "/in/elections/candidate-affidavits",
        ["251", "543", "2024", "Disclosure is not conviction"],
      ],
    ] as const;
    for (const [route, expected] of cases) {
      const $ = page(route);
      expect($("table").length).toBe(1);
      expect($("caption").text().length).toBeGreaterThan(10);
      expect($('thead th[scope="col"]').length).toBeGreaterThan(1);
      expected.forEach((value) => expect($("article").text()).toContain(value));
      expect($(".table-scroll").attr("tabindex")).toBe("0");
      const download = $('a[download][href^="/data/"]').attr("href")!;
      expect(
        JSON.parse(readFileSync(fileFor(download), "utf8")).checked_at,
      ).toBe("2026-10-13");
    }
  });

  test("expansion data panels preserve each row, distinguish asset types and resolve data-only sources", () => {
    const index = JSON.parse(
      readFileSync("content/data-index.json", "utf8"),
    ) as { id: string; path: string }[];
    const sourceRegistry = JSON.parse(
      readFileSync("content/sources.json", "utf8"),
    ) as {
      references: { id: string; url: string; locator: string }[];
    };
    const labels = {
      official_statistics: "Official statistics",
      reference_table: "Reference table",
      synthetic_teaching_example:
        "Hypothetical teaching example — invented inputs, not observed Indian data.",
    };
    let observations = 0;
    for (const item of index) {
      const asset = JSON.parse(readFileSync(item.path, "utf8")) as {
        id: string;
        asset_type: keyof typeof labels;
        reference_period: string;
        source_ref_ids: string[];
        limitations: string[];
        tables: {
          id: string;
          columns: string[];
          csv_path: string;
          rows: Record<string, string | number | boolean | null>[];
        }[];
      };
      expect(
        JSON.parse(readFileSync(`dist/data/${asset.id}.json`, "utf8")),
      ).toEqual(asset);
      const article = articles.find((article) =>
        article.data_ids?.includes(asset.id),
      )!;
      const $ = page(article.route);
      const panel = $(`[data-asset-id="${asset.id}"]`);
      expect(panel.attr("data-asset-type")).toBe(asset.asset_type);
      expect(panel.text()).toContain(labels[asset.asset_type]);
      expect(panel.text()).toContain(asset.reference_period);
      asset.limitations.forEach((limit) =>
        expect(panel.text()).toContain(limit),
      );
      for (const id of asset.source_ref_ids) {
        const ref = sourceRegistry.references.find((ref) => ref.id === id)!;
        expect(panel.find(`a[href="${ref.url}"]`).length).toBeGreaterThan(0);
        expect(panel.text()).toContain(ref.locator);
      }
      for (const table of asset.tables) {
        const rendered = panel.find(`[data-table-id="${table.id}"]`);
        expect(rendered.find("caption").length).toBe(1);
        expect(rendered.find(".table-scroll").attr("tabindex")).toBe("0");
        const rows = rendered.find("tbody tr").toArray();
        expect(rows.length).toBe(table.rows.length);
        const columns = table.columns.filter(
          (column) =>
            ![
              "source_ref_id",
              "source_url",
              "source_locator",
              "published_at",
              "checked_at",
            ].includes(column),
        );
        for (const [i, row] of table.rows.entries()) {
          const cells = $(rows[i]!).children("th,td").toArray();
          expect(cells.slice(0, -1).map((cell) => $(cell).text())).toEqual(
            columns.map((column) =>
              row[column] === null ? "Not supplied" : String(row[column]),
            ),
          );
          expect($(cells.at(-1)!).text()).toContain(String(row.source_locator));
          if (typeof row.source_url === "string")
            expect($(cells.at(-1)!).find("a").attr("href")).toBe(
              row.source_url,
            );
        }
        expect(
          readFileSync(`dist/csv/${table.csv_path.split("/").pop()}`, "utf8"),
        ).toBe(readFileSync(table.csv_path, "utf8"));
        if (asset.asset_type === "official_statistics")
          observations += rows.length;
      }
    }
    expect(observations).toBe(327);
    expect(
      page("/in/action/consultations-and-hearings")("#sources").text(),
    ).toContain("Official-origin document on a third-party mirror.");
  });

  test("full-text search ranks relevant guides, handles prefixes and typos, and excludes URL noise", () => {
    const entries = JSON.parse(
      readFileSync("dist/search-index.json", "utf8"),
    ) as SearchEntry[];
    expect(entries).toHaveLength(64);
    const search = createSearch(entries);
    for (const [query, route] of [
      ["MP", "/in/parliament/mp-role"],
      ["RTI", "/in/action/rti-basics"],
      ["WhatsApp", "/in/media/whatsapp-forward"],
      ["budget", "/in/money/read-a-budget"],
      ["unemployment", "/in/everyday/jobs-and-wages"],
      ["budge", "/in/money/read-a-budget"],
      ["unemploymnt", "/in/everyday/jobs-and-wages"],
    ])
      expect(
        search(query)
          .slice(0, 3)
          .map((result) => result.route),
      ).toContain(route);
    expect(search("")).toEqual([]);
    expect(search("zzqxxunknown")).toEqual([]);
    expect(entries.every((entry) => !entry.text.includes("https://"))).toBe(
      true,
    );
    const isolated = createSearch([
      { route: "/a", title: "MP", summary: "", text: "", hub: "parliament" },
      {
        route: "/b",
        title: "Improvement",
        summary: "",
        text: "",
        hub: "start",
      },
    ]);
    expect(isolated("MP").map((result) => result.route)).toEqual(["/a"]);
  });

  test("Markdown tables classify individual cells before sanitization", async () => {
    const { code: html } = await processor.render(`## Mixed evidence

| 2024 | Label | Value |
| :--- | :---: | ---: |
| 1,234 | Text | 3.1% |
| Narrative | -2 | 2026–27 BE |
| 2024–25 | [1](https://example.com) | **Readable** |
`);
    const $ = load(html);
    expect(
      $("thead th.num")
        .map((_, el) => $(el).text())
        .get(),
    ).toEqual(["2024"]);
    expect(
      $("tbody td.num")
        .map((_, el) => $(el).text())
        .get(),
    ).toEqual(["1,234", "3.1%", "-2", "2024–25"]);
    expect($('thead th[scope="col"]').length).toBe(3);
    expect($("[align]").length).toBe(0);
    expect($("caption").text()).toBe("Mixed evidence");
    expect($(".table-scroll").attr("tabindex")).toBe("0");
    expect($('.citation[href="#source-1"]').text()).toBe("1");
    expect($("td strong").text()).toBe("Readable");
  });

  test("native collection frontmatter selects the source-linked evidence table", async () => {
    const card = evidence.find(
      (card) => card.articleId === "in-dossiers-union-budget-2026",
    )!;
    const { code } = await processor.render(
      "| A | B |\n| --- | --- |\n| x | y |",
      { frontmatter: { id: card.articleId } },
    );
    const $ = load(code);
    const expected = load(evidenceTable(card));
    expect($("table").length).toBe(1);
    expect($("table").text()).toBe(expected("table").text());
    expect($("tbody td.num").length).toBe(12);
    expect($('thead th[scope="col"]').length).toBe(5);
    expect($('tbody th[scope="row"]').length).toBe(3);
    expect($("caption").text()).toBe(card.data.title);
    expect($(".table-scroll").attr("aria-label")).toBe(card.data.title);
  });

  test("untrusted Markdown cannot execute HTML or unsafe links", async () => {
    const { code: html } = await processor.render(
      "## Safe heading\n\n<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n![image](https://example.com/tracker.png)\n\n[bad](javascript:alert%281%29)\n\n[external](//example.com)\n\n[good](/in/start)\n\n**Readable text**",
    );
    const $ = load(html);
    expect($("script,img,iframe,style").length).toBe(0);
    expect($('a[href^="javascript:"]').length).toBe(0);
    expect($('a[href^="//"]').length).toBe(0);
    expect($('a[href="/in/start"]').text()).toBe("good");
    expect($("strong").text()).toBe("Readable text");
  });
});
