---
id: "in-evidence-survey-vs-administrative-data"
route: "/in/evidence/survey-vs-administrative-data"
country: "IN"
language: "en"
hub: "evidence"
title: "Why do two official datasets disagree?"
summary: "Two credible sources can disagree because they cover different people, events or periods. Identify how each number was produced before choosing between them."
kind: "explainer"
reader_task: "Pick two numbers that appear to contradict each other. Compare their unit, population, geography, period and collection method before deciding whether they answer the same question."
related_ids: ["in-everyday-schools-and-exams","in-evidence-question-official-data","in-action-read-an-evasive-reply"]
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
source_ref_ids: ["v3-schools-counts","v3-schools-facilities","v3-aser-method","v3-cpi-method"]
sources: [{"number":1,"ref_id":"v3-schools-counts","document_id":"v3-school-release","title":"UDISE+ 2025–26: Ministry of Education release and tables","publisher":"Ministry of Education, via PIB","url":"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2282141&lang=1&reg=48","locator":"Tables: teacher counts, single-teacher schools and zero-enrolment schools","version":null,"published_at":"2026-07-07","reference_period":"Academic years 2022–23 through 2025–26","checked_at":"2026-10-14","limitations":["Selected tables from the ministry’s release, not a full extraction of the national reports. Administrative reporting is not an independent measure of classroom learning or daily facility functionality. Narrative claims of causal success are not adopted."],"kind":"official_primary"},{"number":2,"ref_id":"v3-schools-facilities","document_id":"v3-school-release","title":"UDISE+ 2025–26: Ministry of Education release and tables","publisher":"Ministry of Education, via PIB","url":"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2282141&lang=1&reg=48","locator":"Tables: computer/internet access and basic infrastructure facilities","version":null,"published_at":"2026-07-07","reference_period":"Academic years 2022–23 through 2025–26","checked_at":"2026-10-14","limitations":["Selected tables from the ministry’s release, not a full extraction of the national reports. Administrative reporting is not an independent measure of classroom learning or daily facility functionality. Narrative claims of causal success are not adopted."],"kind":"official_primary"},{"number":3,"ref_id":"v3-aser-method","document_id":"v3-aser","title":"ASER basic survey design and scope","publisher":"ASER Centre","url":"https://asercentre.org/aser-survey/","locator":"Basic design: rural households; enrolment ages 3–16; basic reading/arithmetic ages 5–16","version":null,"published_at":null,"reference_period":null,"checked_at":"2026-10-14","limitations":["Explains the basic rural household survey. Not all ASER thematic or rapid surveys use this design. No new national learning estimate is extracted here."],"kind":"independent_primary_analysis"},{"number":4,"ref_id":"v3-cpi-method","document_id":"v3-cpi","title":"Consumer Price Index release: September 2026","publisher":"National Statistics Office, MoSPI","url":"https://www.mospi.gov.in/uploads/latestReleases/latest_release_1791800601071_643518af-5320-4e52-b78c-75c92b83885b_Press_Release_for_the_month_of_September,_2026.pdf#page=4","locator":"PDF page 4: price collection, precision, coverage and interpretation notes","version":"CPI base 2024=100","published_at":"2026-10-12","reference_period":"September 2026 provisional; August 2026 final","checked_at":"2026-10-14","limitations":["Year-on-year rates are not month-on-month price changes. CFPI is not identical to the Food and Beverages division. September figures are provisional. Rounded indices do not reproduce every published rate exactly."],"kind":"official_primary"}]
word_count: 530
estimated_reading_minutes: 3
content_sha256: "64f53650aa85192297fc4ffa65f27688813d4c6f15b1a634806ed0693afed0bd"
maintenance: {"trigger":"Material change to a cited provision or method; revised statistical release; substantiated correction","suggested_recheck_days":365,"automation_created":false}
data_ids: ["v3-udise-2025-26"]
release_batch: "expansion-v3"
---

A department reports that nearly every school has a facility. A household survey finds a serious learning gap. These statements do not necessarily conflict. A facility and a learning outcome are different things, measured through different systems.

**Administrative data** is generated through operating or reporting systems: enrolment records, applications, inspections or payments, for example. A **survey** collects information using a designed set of questions and a specified sample or population. The distinction describes how information is produced, not an automatic ranking of truthfulness.

## Start with the unit being counted

Ask whether a row represents a person, household, school, application, transaction or event. One person may generate several applications. One school may report many facilities. Adding rows is not always a count of distinct people.

Then identify who is outside the system. An applicant database cannot, without additional evidence, tell you how many eligible people never applied. A record of completed inspections is not a census of every potentially non-compliant site.

These are coverage questions, not reasons to discard the records. A source can be useful for one question and insufficient for another.

## A school-data example

The Education Ministry’s UDISE+ 2025–26 release reports teacher and school-facility indicators. Its tables can support a statement about the reported count or percentage in that system. They do not directly establish that every listed facility worked each day or that pupils mastered a particular skill. [1](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2282141&lang=1&reg=48) [2](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2282141&lang=1&reg=48)

ASER’s basic survey instead visits rural households and assesses basic reading and arithmetic among children aged 5–16, alongside enrolment information for ages 3–16. Its household approach can reach children outside school, but this basic rural design does not represent all urban children. [3](https://asercentre.org/aser-survey/)

Do not describe one source as disproving the other until the indicator, population and period actually match.

## Sampling error is only one possible problem

A sample estimate needs its design, weighting and uncertainty considered. Administrative totals may not have sampling error in the same sense, but can still contain missing records, duplicates, reporting incentives, delayed updates or changing definitions.

The appropriate question is which limitations the producer examined and disclosed. “A large database” does not answer that. Nor does “only a sample” establish that a carefully designed survey is useless.

For prices, MoSPI explains its market and village coverage and collection procedure. Knowing that procedure is part of interpreting the resulting national index; a handful of receipts follows a different selection process. [4](https://www.mospi.gov.in/uploads/latestReleases/latest_release_1791800601071_643518af-5320-4e52-b78c-75c92b83885b_Press_Release_for_the_month_of_September,_2026.pdf#page=4)

## Build a compatibility check before a chart

For each series, record the producer, collection method, unit, geography, period, population, definition and revision status. Place those fields side by side.

A change in coverage can create an apparent trend. A new definition can make two identically named indicators non-comparable. When you cannot resolve the difference, show separate series with a clear break rather than joining the points into an apparently continuous line.

Missing values should remain missing with a reason. Do not replace an unavailable figure with zero or assume that an authority’s lack of centrally held records means the underlying activity never occurred.

The goal is a conclusion proportional to the measurement: this source records these events, or estimates this outcome for this population. Broader conclusions need broader evidence.
