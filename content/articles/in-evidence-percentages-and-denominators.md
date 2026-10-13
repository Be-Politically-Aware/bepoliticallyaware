---
id: "in-evidence-percentages-and-denominators"
route: "/in/evidence/percentages-and-denominators"
country: "IN"
language: "en"
hub: "evidence"
title: "Percent of what, and compared with when?"
summary: "A percentage only becomes meaningful when you know what it divides by."
kind: "explainer"
reader_task: "Take a percentage from a headline. Write the numerator, denominator, period and unit, then reproduce the calculation or mark the missing inputs."
related_ids:
  - "in-everyday-jobs-and-wages"
  - "in-money-estimates-revised-actuals"
  - "in-crime-crime-statistics"
quiz:
  question: "A share rises from 20% to 25%. Which description is correct?"
  options:
    - "A 5% relative increase."
    - "A 5-percentage-point increase and a 25% relative increase."
    - "A 25-percentage-point increase."
  answer_index: 1
  explanation: "The difference is 5 points; relative growth is 5 divided by the original 20, or 25%."
launch_order: 25
status: "ready"
publish: true
research_checked_at: "2026-10-13"
human_reviewed: false
review_method: "Assistant retrieval, source comparison and numerical checks; not independent human review"
jurisdiction: "India; local administrative responsibility must be checked for the actual location"
legal_scope: "General civic education, not individual legal advice"
version: "2.0.0"
source_ref_ids:
  - "plfs-definitions"
sources:
  - number: 1
    ref_id: "plfs-definitions"
    document_id: "plfs-release"
    title: "Periodic Labour Force Survey Annual Report 2025: release and methods note"
    publisher: "Ministry of Statistics and Programme Implementation, published by PIB"
    url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2246009&lang=1&reg=3"
    locator: "Endnote D: definitions of LFPR, WPR, UR, usual status and current weekly status"
    version: null
    published_at: "2026-03-27"
    reference_period: "January–December 2025"
    checked_at: "2026-10-13"
    limitations:
      - "This release, not the full underlying report, is the inspected numerical source. Annual usual-status estimates are not current-month unemployment or a job-quality measure."
    kind: "official_primary"
maintenance:
  trigger: "Change to a cited provision, source correction or substantiated reader correction"
  suggested_recheck_days: 365
  automation_created: false
---

“Cases rose 50%” may sound more informative than it is. Ask: how many cases, among whom, over what period, and counted in the same way?

The **numerator** is the quantity being counted. The **denominator** is what it is divided by. Changing the denominator changes the question.

## Percentage and percentage point are different

In a **hypothetical example**, a share rises from 20% to 25%. That is an increase of **5 percentage points**. Relative to the original 20%, it is a **25% increase**: `(25 − 20) / 20 × 100`.

Neither calculation says that the underlying number of people rose by 25% unless the population and other necessary conditions support that conclusion.

## Counts and rates can tell different stories

Imagine two hypothetical towns. Town A records 100 incidents among 100,000 residents. Town B records 150 among 300,000 residents. A has 100 recorded incidents per 100,000 residents; B has 50.

B has the larger count and the lower population rate. Before treating that rate as a risk comparison, you would still need compatible definitions, reporting practices and an appropriate population measure. Arithmetic cannot repair incomparable inputs.

## A real example: unemployment

MoSPI defines the unemployment rate using unemployed people as a share of the labour force, not the whole population. Its worker population ratio uses employed people as a share of the relevant population. Confusing those denominators produces a different statistic. [1](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2246009&lang=1&reg=3)

This is why you should not read an unemployment rate as “the share of all Indians without a job”. Preserve the survey's age group, reference period and activity-status measure as well.

## Read the axis and the missing values

On a chart, check whether the vertical scale begins at zero, whether time intervals are equal and whether a line connects missing observations as though they were measured. A truncated scale can be legitimate, but it needs to be obvious enough not to disguise the size of a change.

Treat “not reported” as unknown, not zero. Do not add percentages from different populations or average rates without appropriate weights.

A useful numerical caption answers: **what was counted, out of what, where, when, in which unit and by what method?** If those answers are missing, hold the interpretation until you find them.
