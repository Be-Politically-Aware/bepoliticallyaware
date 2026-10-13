import budget from "../../content/data/union-budget-2026-27-expenditure.json";
import plfs from "../../content/data/plfs-2025-annual-usual-status.json";
import road from "../../content/data/road-deaths-2024-parliament-answer.json";
import adr from "../../content/data/adr-2024-winning-candidate-disclosures.json";
import { escapeHtml } from "./markdown";

const integer = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
export const evidence = [
  {
    data: budget,
    articleId: "in-dossiers-union-budget-2026",
    columns: [
      "Measure",
      "2024–25 Actuals",
      "2025–26 BE",
      "2025–26 RE",
      "2026–27 BE",
    ],
    rows: budget.rows.map((r) => [r.label, ...r.values.map(integer)]),
    scope:
      "All amounts in ₹ crore. 2026–27 BE compared with 2025–26 RE; estimates are not service outcomes.",
    replacesTable: true,
  },
  {
    data: plfs,
    articleId: "in-everyday-jobs-and-wages",
    columns: ["Indicator", "Percent", "Denominator"],
    rows: plfs.indicators.map((r) => [r.name, String(r.value), r.denominator]),
    scope: `${plfs.reference_period}; ${plfs.age_group}; ${plfs.activity_status}; ${plfs.geography}; ${plfs.sex}.`,
    replacesTable: false,
  },
  {
    data: road,
    articleId: "in-dossiers-road-deaths-2024",
    columns: ["Series", "Category in the answer", "Reported deaths"],
    rows: road.observations.map((r) => [
      r.series,
      r.definition_in_answer,
      integer(r.value),
    ]),
    scope: `${road.reference_period}. ${road.attribution}`,
    replacesTable: true,
  },
  {
    data: adr,
    articleId: "in-elections-candidate-affidavits",
    columns: ["2024 winning-candidate records", "Count"],
    rows: [
      ["Records declaring criminal cases", integer(adr.numerator)],
      ["Records analysed", integer(adr.denominator)],
    ],
    scope: `${adr.reference_period}. ${adr.source_type}. Disclosure is not conviction.`,
    replacesTable: false,
  },
];
export function evidenceTable(card: (typeof evidence)[number]) {
  const e = escapeHtml;
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="${e(card.data.title)}"><table><caption>${e(card.data.title)}</caption><thead><tr>${card.columns.map((c) => `<th scope="col">${e(c)}</th>`).join("")}</tr></thead><tbody>${card.rows.map((row) => `<tr>${row.map((cell, i) => (i === 0 ? `<th scope="row">${e(cell)}</th>` : `<td>${e(cell)}</td>`)).join("")}</tr>`).join("")}</tbody></table></div>`;
}
