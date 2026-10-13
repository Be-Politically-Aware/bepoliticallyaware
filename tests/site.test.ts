import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "cheerio";
import { articles, sections, paths, glossary } from "../src/lib/content";
import backlog from "../roadmap/backlog.json";
import { renderMarkdown } from "../src/lib/markdown";
import { evidence, evidenceTable } from "../src/lib/evidence";
import { createSearch, type SearchEntry } from "../src/lib/search";

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
  test("all published routes, citations and exact source locators are present", () => {
    expect(articles).toHaveLength(40);
    for (const route of publicRoutes)
      expect(existsSync(fileFor(route))).toBe(true);
    for (const article of articles) {
      const $ = page(article.route);
      expect($("h1").text()).toBe(article.title);
      expect($("time").attr("datetime")).toBe(article.research_checked_at);
      expect($(".sources li").length).toBe(article.sources.length);
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

  test("full-text search ranks relevant guides, handles prefixes and typos, and excludes URL noise", () => {
    const entries = JSON.parse(
      readFileSync("dist/search-index.json", "utf8"),
    ) as SearchEntry[];
    expect(entries).toHaveLength(40);
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

  test("Markdown tables classify individual cells before sanitization", () => {
    const { html } = renderMarkdown(`## Mixed evidence

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

  test("evidence replacement retains only num cell classes through sanitization", () => {
    const card = {
      ...evidence[0],
      columns: ["2024", "Label", "Value"],
      rows: [
        ["123", "Text", "3.1%"],
        ["Narrative", "-2", "2026–27 BE"],
      ],
    };
    const replacement = evidenceTable(card)
      .replaceAll('class="num"', 'class="num arbitrary"')
      .replace("<td>", '<td class="arbitrary" onclick="alert(1)">');
    const $ = load(
      renderMarkdown("| A | B |\n| --- | --- |\n| x | y |", replacement).html,
    );
    expect($("table").length).toBe(1);
    expect($("thead th.num").text()).toBe("2024");
    expect($('tbody th[scope="row"].num').text()).toBe("123");
    expect(
      $("tbody td.num")
        .map((_, el) => $(el).text())
        .get(),
    ).toEqual(["3.1%", "-2"]);
    expect($('thead th[scope="col"]').length).toBe(3);
    expect($('tbody th[scope="row"]').length).toBe(2);
    expect($(".arbitrary,[onclick]").length).toBe(0);
    expect($("caption").text()).toBe(card.data.title);
    expect($(".table-scroll").attr("aria-label")).toBe(card.data.title);
  });

  test("untrusted Markdown cannot execute HTML or unsafe links", () => {
    const { html } = renderMarkdown(
      "## Safe heading\n\n<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[bad](javascript:alert%281%29)\n\n[good](/in/start)\n\n**Readable text**",
    );
    const $ = load(html);
    expect($("script,img,iframe,style").length).toBe(0);
    expect($('a[href^="javascript:"]').length).toBe(0);
    expect($('a[href="/in/start"]').text()).toBe("good");
    expect($("strong").text()).toBe("Readable text");
  });
});
