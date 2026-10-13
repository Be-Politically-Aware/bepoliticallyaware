#!/usr/bin/env python3
"""Validate the local content contract and arithmetic, without network access.

This checks structure and consistency. It does not prove source truth, current
law, or continued availability of a remote URL. Run from any working directory.
"""
from __future__ import annotations
import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
ERRORS: list[str] = []
CHECKS = 0

def require(condition: bool, message: str) -> None:
    global CHECKS
    CHECKS += 1
    if not condition:
        ERRORS.append(message)

def load(relative: str):
    with (ROOT / relative).open(encoding="utf-8") as handle:
        return json.load(handle)

def validate() -> dict:
    bundle = load("content/articles.json")
    articles = bundle["articles"]
    index = load("content/article-index.json")
    sources = load("content/sources.json")
    nav = load("content/navigation.json")
    docs = {d["id"]: d for d in sources["documents"]}
    refs = {r["id"]: r for r in sources["references"]}
    ids = {a["id"] for a in articles}
    routes = {a["route"] for a in articles}
    require(len(articles) == bundle["article_count"] == 40, "Expected 40 ready articles.")
    require(len(ids) == len(routes) == len(articles), "Duplicate article ID or route.")
    require({a["id"] for a in index} == ids, "Search index differs from article set.")
    require(sorted(a["launch_order"] for a in articles if a["launch_order"] is not None) == list(range(1, 33)), "Original 32 launch pages are not complete.")
    for a in articles:
        label = a["id"]
        body = a["body_markdown"]
        require(a["status"] == "ready" and a["publish"] is True, f"{label}: not publishable.")
        require(a["country"] == "IN" and a["language"] == "en", f"{label}: invalid country/language.")
        require(a["route"].startswith("/in/"), f"{label}: missing country route.")
        require(len(body.split()) > 250, f"{label}: missing or unexpectedly short finished body.")
        require("{{" not in body and "}}" not in body, f"{label}: unresolved citation token.")
        require(not re.search(r"\b(?:TODO|TBD|lorem ipsum)\b", body, re.I), f"{label}: placeholder in article body.")
        require(a["human_reviewed"] is False, f"{label}: invented human review.")
        require(a["content_sha256"] == hashlib.sha256(body.encode()).hexdigest(), f"{label}: content hash mismatch.")
        require(bool(a["reader_task"]), f"{label}: missing reader task.")
        require(set(a["related_ids"]).issubset(ids), f"{label}: related unpublished/unknown article.")
        require(set(a["source_ref_ids"]).issubset(refs), f"{label}: unknown source locator.")
        require(a["source_ref_ids"] == [s["ref_id"] for s in a["sources"]], f"{label}: source order differs.")
        numbers = [s["number"] for s in a["sources"]]
        require(numbers == list(range(1, len(numbers)+1)), f"{label}: invalid source numbering.")
        citations = re.findall(r"\[(\d+)\]\((https?://[^\s]+)\)", body)
        source_map = {str(s["number"]): s["url"] for s in a["sources"]}
        for number, url in citations:
            require(source_map.get(number) == url, f"{label}: citation {number} URL mismatch.")
        require(set(n for n, _ in citations) == set(source_map), f"{label}: missing or unreferenced source number.")
        for destination in re.findall(r"\]\((/in/[^\s)]+)\)", body):
            require(destination in routes, f"{label}: unresolved internal link {destination}.")
        portable = ROOT / "content/articles" / f"{label}.md"
        require(portable.exists(), f"{label}: missing Markdown export.")
        if portable.exists():
            require(body in portable.read_text(encoding="utf-8"), f"{label}: JSON/Markdown body differs.")
        if a.get("quiz"):
            q = a["quiz"]
            require(0 <= q["answer_index"] < len(q["options"]), f"{label}: invalid quiz answer.")
    for d in docs.values():
        u = urlsplit(d["url"])
        require(u.scheme == "https" and bool(u.netloc), f"Invalid source URL: {d['id']}.")
        require(bool(d["access_scope"]), f"Missing access scope: {d['id']}.")
    for r in refs.values():
        require(r["document_id"] in docs and bool(r["locator"]), f"Invalid exact reference: {r['id']}.")
    for item in load("content/glossary.json"):
        require(item["article_id"] in ids and item["route"] in routes, f"Invalid glossary destination: {item['term']}.")
        require(set(item["source_ref_ids"]).issubset(refs), f"Unknown glossary source: {item['term']}.")
    for path in nav["reading_paths"]:
        require(set(path["article_ids"]).issubset(ids), f"Invalid reading path: {path['id']}.")
    for hub in nav["hubs"]:
        require(set(hub["article_ids"]).issubset(ids), f"Invalid hub: {hub['id']}.")
    backlog = load("roadmap/backlog.json")["pages"]
    require(len(backlog) == 141, "Expected 141 still-unwritten original briefs.")
    require(not ({b["id"] for b in backlog} & ids), "Published and planned sets overlap.")
    require(all(b["publish"] is False and b["status"] == "planned" for b in backlog), "Planned brief marked public.")
    budget = load("content/data/union-budget-2026-27-expenditure.json")
    total, revenue, capital = (r["values"] for r in budget["rows"])
    for i in range(4):
        require(revenue[i] + capital[i] == total[i], f"Budget column {i}: total mismatch.")
    growth = (total[3] - total[2]) / total[2] * 100
    require(round(growth, 2) == 7.70, "Budget growth does not round to 7.70%.")
    require(abs(growth - budget["calculations"][0]["value"]) < 1e-12, "Stored budget calculation differs.")
    road = load("content/data/road-deaths-2024-parliament-answer.json")
    vals = [o["value"] for o in road["observations"]]
    require(vals == [177175, 175142, 162500], "Road data values differ from checked transcription.")
    require(vals[0] - vals[1] == road["calculations"][0]["value"] == 2033, "Road difference mismatch.")
    plfs = load("content/data/plfs-2025-annual-usual-status.json")
    require([i["value"] for i in plfs["indicators"]] == [59.3, 57.4, 3.1], "PLFS transcription mismatch.")
    require(plfs["age_group"] == "15 years and above", "PLFS age scope lost.")
    adr = load("content/data/adr-2024-winning-candidate-disclosures.json")
    require(round(adr["numerator"] / adr["denominator"] * 100) == adr["reported_rounded_percentage"], "ADR rounded share mismatch.")
    require(abs(adr["computed_percentage"] - 251 / 543 * 100) < 1e-12, "ADR computed share mismatch.")
    for passage in load("evidence/passage-ledger.json")["passages"]:
        require(passage["article_id"] in ids and set(passage["source_ref_ids"]).issubset(refs), f"Unresolved evidence association: {passage['id']}.")
    report = {
        "passed": not ERRORS,
        "checks": CHECKS,
        "articles": len(articles),
        "original_launch_articles": 32,
        "source_documents": len(docs),
        "exact_source_locators": len(refs),
        "errors": ERRORS,
        "scope": "Local structure, internal links, export parity, citation-reference consistency, hashes and selected arithmetic checks.",
        "not_tested": ["Network availability of remote URLs", "Automated proof of factual truth", "Independent human or legal review", "Production frontend accessibility or deployment"],
    }
    (ROOT / "checks").mkdir(exist_ok=True)
    (ROOT / "checks/validation.json").write_text(json.dumps(report, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    return report

if __name__ == "__main__":
    try:
        result = validate()
    except (OSError, KeyError, TypeError, ValueError) as exc:
        print(f"Validation could not complete: {exc}", file=sys.stderr)
        raise SystemExit(2)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(0 if result["passed"] else 1)
