---
id: "in-evidence-correlation-and-causation"
route: "/in/evidence/correlation-and-causation"
country: "IN"
language: "en"
hub: "evidence"
title: "Did this policy actually cause the result?"
summary: "A result improving after a policy does not establish how much the policy caused. Ask what would otherwise have happened and whether the comparison is credible."
kind: "explainer"
reader_task: "Choose a policy-success claim. Identify its counterfactual or comparison group and one alternative explanation the evidence would need to address."
related_ids: ["in-money-from-allocation-to-outcome","in-evidence-survey-vs-administrative-data","in-start-reasonable-disagreement"]
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
source_ref_ids: ["v3-counterfactual","v3-equal-trends","v3-output-outcome"]
sources: [{"number":1,"ref_id":"v3-counterfactual","document_id":"v3-impact","title":"Impact Evaluation in Practice, Second Edition","publisher":"World Bank and Inter-American Development Bank","url":"https://documents1.worldbank.org/curated/en/698441474029568469/pdf/108270-PUB-Box396299B-PUBLIC-PUBDATE-9-13-16.pdf#page=79","locator":"Chapter 3, especially printed page 49 / PDF page 79: counterfactual; subsequent before/after discussion","version":"Second Edition","published_at":"2016","reference_period":null,"checked_at":"2026-10-14","limitations":["Method explanation, not an evaluation of an Indian policy. Numerical teaching examples in this pack are newly authored and explicitly synthetic."],"kind":"method_author_primary"},{"number":2,"ref_id":"v3-equal-trends","document_id":"v3-impact","title":"Impact Evaluation in Practice, Second Edition","publisher":"World Bank and Inter-American Development Bank","url":"https://documents1.worldbank.org/curated/en/698441474029568469/pdf/108270-PUB-Box396299B-PUBLIC-PUBDATE-9-13-16.pdf#page=167","locator":"Chapter 7, printed pages 137–138 / PDF pages 167–168: assessing the equal-trends assumption","version":"Second Edition","published_at":"2016","reference_period":null,"checked_at":"2026-10-14","limitations":["Method explanation, not an evaluation of an Indian policy. Numerical teaching examples in this pack are newly authored and explicitly synthetic."],"kind":"method_author_primary"},{"number":3,"ref_id":"v3-output-outcome","document_id":"v3-oomf","title":"Output Outcome Monitoring Framework 2026–27","publisher":"Government of India / Union Budget","url":"https://www.indiabudget.gov.in/doc/OutcomeBudgetE2026_2027.pdf#page=5","locator":"Preface, PDF page 5: outlay, output, outcome and annual targets","version":"2026–27 major Central Sector and Centrally Sponsored schemes","published_at":null,"reference_period":"FY 2026–27 targets","checked_at":"2026-10-14","limitations":["Budget targets are not achievements. An outcome indicator can be an imperfect proxy for the public benefit of interest."],"kind":"official_primary"}]
word_count: 486
estimated_reading_minutes: 3
content_sha256: "a4c2d6cf370153a0a4b946df1aa62bc489a96b547f489a72efcd16d15023d5a8"
maintenance: {"trigger":"Material change to a cited provision or method; revised statistical release; substantiated correction","suggested_recheck_days":365,"automation_created":false}
data_ids: ["v3-teaching-calculations"]
release_batch: "expansion-v3"
---

A programme starts. A measured outcome improves. The sequence is worth investigating, but it does not by itself measure the programme’s effect.

The missing comparison is the **counterfactual**: what would have happened to the same outcome without the intervention. The World Bank’s impact-evaluation guide explains why a simple before-and-after comparison can confuse a programme’s effect with other changes over time. [1](https://documents1.worldbank.org/curated/en/698441474029568469/pdf/108270-PUB-Box396299B-PUBLIC-PUBDATE-9-13-16.pdf#page=79)

## A calculation that shows the problem

**Entirely hypothetical example:** A school programme begins in one group of schools. Absence falls from 20% to 12%. In a comparison group without the programme, absence falls from 18% to 14% over the same period.

| Group | Before | After | Change |
|---|---|---|---|
| Programme schools | 20% | 12% | −8 percentage points |
| Comparison schools | 18% | 14% | −4 percentage points |

The first group improved by 8 percentage points. But a comparison-adjusted change is **−8 − (−4) = −4 percentage points**. This is the arithmetic behind a simple difference-in-differences comparison, not proof that any real Indian programme reduced absence by that amount.

That interpretation depends on assumptions. In particular, absent the programme, the groups’ outcomes must have followed sufficiently comparable trends, and other changes must not differentially explain the result. The World Bank guide discusses examining earlier trends while warning that such checks cannot conclusively prove the assumption. [2](https://documents1.worldbank.org/curated/en/698441474029568469/pdf/108270-PUB-Box396299B-PUBLIC-PUBDATE-9-13-16.pdf#page=167)

## Check who received the programme

A comparison can be distorted if participating schools were selected because they had unusual resources, unusually severe problems or a different expected trajectory. Similar averages before the programme do not eliminate every difference.

Ask whether the comparison group was affected indirectly, whether another intervention occurred at the same time and whether data collection changed. Also check whether the outcome was chosen before analysis or selected afterward because it looked favourable.

These questions do not make evaluation impossible. They identify which explanations a credible study must address.

## Administrative success is not automatically causal success

A department can accurately report that it built facilities or paid benefits without establishing the size of their effect on health, education or income. The government’s output-outcome framework itself distinguishes direct outputs from intended results. [3](https://www.indiabudget.gov.in/doc/OutcomeBudgetE2026_2027.pdf#page=5)

Equally, an outcome can fail to improve even when an intervention prevented a worse decline. The absence of a simple upward trend does not settle causation either. A credible comparison matters in both directions.

## How to read a strong causal claim

Look for the exact intervention, outcome, population and period. Then find the comparison method, assumptions, uncertainty and alternative explanations. Check whether the published conclusion is narrower than the headline.

Do not turn “associated with” into “caused by”. Do not turn a study of one population into a guarantee for every district. A transparent observational study may still be useful when its limits are stated; pretending those limits do not exist makes it less useful.

A practical verdict can remain provisional: “The outcome improved after the programme, but this evidence does not isolate its effect.” That sentence preserves the observed improvement without inventing a causal estimate.
