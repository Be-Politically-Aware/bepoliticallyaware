---
id: "in-evidence-nominal-real-per-person"
route: "/in/evidence/nominal-real-per-person"
country: "IN"
language: "en"
hub: "evidence"
title: "Has spending really increased?"
summary: "A larger rupee total can buy little more, or less per person. Separate price changes, population changes and accounting stages before judging growth."
kind: "explainer"
reader_task: "Rewrite a “record spending” headline with its accounting stage, price basis and population. Calculate only the comparisons the source data actually supports."
related_ids: ["in-money-debt-deficit-and-interest","in-everyday-healthcare","in-money-from-allocation-to-outcome"]
quiz: null
launch_order: null
status: "ready"
publish: true
research_checked_at: "2026-10-14"
human_reviewed: false
review_method: "Assistant retrieval, source comparison, source-table inspection and reproducible numerical checks; not independent human review"
jurisdiction: "India; national civic explanation with jurisdiction-specific limits stated in the article"
legal_scope: "General civic education, not individual legal, medical or investment advice"
version: "3.0.0"
source_ref_ids: ["v3-cpi-headline","v3-cpi-divisions","v3-health-gdp","v3-budget-table"]
sources: [{"number":1,"ref_id":"v3-cpi-headline","document_id":"v3-cpi","title":"Consumer Price Index release: September 2026","publisher":"National Statistics Office, MoSPI","url":"https://www.mospi.gov.in/uploads/latestReleases/latest_release_1791800601071_643518af-5320-4e52-b78c-75c92b83885b_Press_Release_for_the_month_of_September,_2026.pdf#page=1","locator":"PDF page 1: rural/urban/combined CPI and CFPI inflation and indices","version":"CPI base 2024=100","published_at":"2026-10-12","reference_period":"September 2026 provisional; August 2026 final","checked_at":"2026-10-14","limitations":["Year-on-year rates are not month-on-month price changes. CFPI is not identical to the Food and Beverages division. September figures are provisional. Rounded indices do not reproduce every published rate exactly."],"kind":"official_primary"},{"number":2,"ref_id":"v3-cpi-divisions","document_id":"v3-cpi","title":"Consumer Price Index release: September 2026","publisher":"National Statistics Office, MoSPI","url":"https://www.mospi.gov.in/uploads/latestReleases/latest_release_1791800601071_643518af-5320-4e52-b78c-75c92b83885b_Press_Release_for_the_month_of_September,_2026.pdf#page=6","locator":"Annexure I, PDF page 6: division-wise indices and year-on-year inflation; division code 12 absent","version":"CPI base 2024=100","published_at":"2026-10-12","reference_period":"September 2026 provisional; August 2026 final","checked_at":"2026-10-14","limitations":["Year-on-year rates are not month-on-month price changes. CFPI is not identical to the Food and Beverages division. September figures are provisional. Rounded indices do not reproduce every published rate exactly."],"kind":"official_primary"},{"number":3,"ref_id":"v3-health-gdp","document_id":"v3-health","title":"National Health Accounts 2022–23 release","publisher":"Ministry of Health and Family Welfare, via PIB","url":"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2265816&lang=1&reg=3","locator":"GDP note: FY 2022–23 GHE/GDP is 1.43% in the earlier presentation and 1.48% using the new GDP series with base 2022–23","version":null,"published_at":"2026-05-27","reference_period":"FY 2013–14, 2021–22 and 2022–23 (selected comparisons)","checked_at":"2026-10-14","limitations":["The source is the official release, not the full report. Percentages use different denominators. Rounded expenditure amounts must not be converted into invented exact totals. Aggregate spending does not establish access, quality or individual bills."],"kind":"official_primary"},{"number":4,"ref_id":"v3-budget-table","document_id":"v3-budget","title":"Budget at a Glance 2026–27","publisher":"Ministry of Finance","url":"https://www.indiabudget.gov.in/doc/Budget_at_Glance/bag1.pdf#page=3","locator":"Printed page 1 / PDF page 3: complete main table and GDP/adjustment notes","version":"Union Budget 2026–27","published_at":null,"reference_period":"FY 2024–25 actuals; FY 2025–26 BE and RE; FY 2026–27 BE","checked_at":"2026-10-14","limitations":["Union figures, not consolidated Union/state/local finances. Estimates are not actual expenditure. Published crore values can produce small arithmetic differences because of rounding; no source total is silently adjusted."],"kind":"official_primary"}]
word_count: 488
estimated_reading_minutes: 3
content_sha256: "01bcfea5e81a8436935ebb661413fabdae7c7ebf75e91dba3f5225731f0ace97"
maintenance: {"trigger":"Material change to a cited provision or method; revised statistical release; substantiated correction","suggested_recheck_days":365,"automation_created":false}
data_ids: ["v3-teaching-calculations","v3-nha-2022-23"]
release_batch: "expansion-v3"
---

“Spending increased by 10%” answers only part of the question. Ten percent of what, compared with which year, at which prices, and for how many people?

**Nominal** means the amount expressed in the money values of the period. A **real** comparison adjusts for price changes using an appropriate price measure. **Per-person** divides by a defined population. These adjustments answer different questions; none automatically measures service quality.

## A worked example with invented numbers

Everything in this example is hypothetical. It is not an Indian budget series.

Suppose a programme spends ₹100 crore in Year A and ₹110 crore in Year B. The relevant price index rises from 100 to 108, and the covered population rises from 100,000 to 105,000 people.

| Comparison | Calculation | Result |
|---|---|---|
| Nominal spending growth | 110 / 100 − 1 | 10.00% |
| Real spending in Year A prices | 110 × 100 / 108 | About ₹101.85 crore |
| Real spending growth | 110 / 108 − 1 | About 1.85% |
| Real spending per person growth | (110 / 100) / (108 / 100) / (105,000 / 100,000) − 1 | About −3.00% |

The nominal total rose, real total spending rose a little, and real spending per person fell. There is no contradiction. The accompanying teaching dataset stores the inputs and calculations, explicitly labelled synthetic.

## Choose a price measure that matches the question

Do not automatically use headline consumer inflation to deflate every government programme. The prices relevant to household purchases need not match those for construction, medical equipment or another programme’s inputs.

MoSPI’s September 2026 release distinguishes the overall consumer basket, food measures and detailed divisions, and specifies a 2024 index base. That is a reminder to state the price series and base you actually used, rather than attaching an unexplained “inflation adjusted” label. [1](https://www.mospi.gov.in/uploads/latestReleases/latest_release_1791800601071_643518af-5320-4e52-b78c-75c92b83885b_Press_Release_for_the_month_of_September,_2026.pdf#page=1) [2](https://www.mospi.gov.in/uploads/latestReleases/latest_release_1791800601071_643518af-5320-4e52-b78c-75c92b83885b_Press_Release_for_the_month_of_September,_2026.pdf#page=6)

Keep the periods aligned. Comparing a financial-year expenditure with a single month’s year-on-year inflation rate may not answer the intended question.

## A GDP ratio is a different adjustment

Spending divided by GDP expresses its size relative to measured economic output. It is not the same calculation as spending per person or a direct purchasing-power adjustment.

The National Health Accounts release illustrates a denominator change: the same 2022–23 government health expenditure is presented as 1.43% of GDP and as 1.48% with the new GDP series. Those figures must not be plotted as successive spending increases. [3](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2265816&lang=1&reg=3)

## Do not repair one comparison while breaking another

Before doing any price adjustment, check the accounting stage. The Union Budget’s table distinguishes actuals, budget estimates and revised estimates. A real-terms comparison still misleads if an article calls a proposed allocation an achieved expenditure. [4](https://www.indiabudget.gov.in/doc/Budget_at_Glance/bag1.pdf#page=3)

Also define the population. All residents, eligible applicants, enrolled pupils and actual service users are not interchangeable denominators. A higher per-user figure could reflect fewer users rather than a better service.

Publish the input values, formula, units and rounding. Then state the limited conclusion: spending increased in this defined sense. Whether that money produced better public services remains a separate question.
