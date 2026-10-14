# Research notes and evidence limits

**Research check date: 14 October 2026.** This release builds on the 40 articles supplied in v2. Its scope is 24 previously unwritten roadmap pages, not a new audit of all existing content.

## Findings that shaped the articles

### Prices: keep rate, index and category separate

The September 2026 MoSPI release gives combined headline year-on-year inflation of 5.54% and CFPI inflation of 7.74%, both provisional, on a 2024=100 base. August's final headline rate is 4.83%. The Food and beverages division is 7.36%, not CFPI's 7.74%. The original PDF headline and division tables were visually inspected; the data reproduces those tables only, not every state, group or item series. See `v3-cpi-headline` and `v3-cpi-divisions`.

### Schools: the table is narrower than the narrative

The Education Ministry's 7 July 2026 release gives secondary dropout as 8.2% then 7.0%, but middle dropout as 3.5% then 3.6%, across 2024–25 and 2025–26. A broad sentence about uniform decline overstates its own table. The pack retains the values and labels, without inferring the cause or statistical significance of the change. All 32 selected series are transcribed from accessible original HTML tables. The complete UDISE+ report PDFs were not retrieved successfully. See `v3-schools-progression`.

### Health: different GDP denominators are not different years

The NHA 2022–23 release dated 27 May 2026 reports GHE/GDP as 1.43% and as 1.48% with the new GDP series. These are alternative ratios for the same reference year. It also gives OOPE/THE as 39.4% in 2021–22 and 43.4% in 2022–23, despite a longer-term fall from 2013–14. Both comparisons are retained. The full NHA PDF could not be inspected; only figures explicit in the official release are used. No ministry claim that a particular programme caused the result is adopted. See `v3-health-spending` and `v3-health-gdp`.

### Budget: an increasing rupee deficit and decreasing GDP ratio coexist

The FY 2025–26 Revised Estimate fiscal deficit is ₹15,58,492 crore / 4.4% of GDP; the FY 2026–27 Budget Estimate is ₹16,95,768 crore / 4.3%. These are different periods and estimate stages, not actual results. The main table was visually inspected. Rounding produces small residuals, including two crore when reconstructing the 2024–25 fiscal deficit from multiple rounded components. The source values are preserved and residuals recorded. See `v3-budget-table`.

### Political money: a disclosure is not a corruption finding

The articles distinguish party contribution reports, audited accounts, party election statements and candidate accounts. The 21 March 2024 ECI notice establishes a disclosure event, not an independent audit of SBI transactions. The Supreme Court's 2 August 2024 order distinguishes the earlier scheme-validity judgment from the investigation petitions and discusses ordinary remedies. The original February judgment was not successfully retrieved in full, so the article relies explicitly on the later court order's recap. No named donor totals or transaction inferences have been manufactured. See `v3-finance-records`, `v3-bonds-disclosed`, `v3-bonds-court` and `v3-candidate-expenses`.

### Consultation: an absence of centrally held records is not proof of no activity

The 12 December 2025 answer to Lok Sabha Unstarred Question 2110 says the ministry had not evaluated the consultation policy and did not maintain the requested compliance records. The articles avoid turning that answer into a claim that no department consulted the public, or a statement of the ministry's position for all future dates. The 2014 policy copy includes an exception for recording reasons where the process is infeasible or undesirable. Its 30-day language is not presented as an unconditional statutory deadline. See `v3-plcp-reply`, `v3-consultation-policy` and `v3-consultation-exceptions`.

## Access and verification log

The source registry records inspection scope and limitations document by document. In particular:

- Official constitutional text: cover and cited provisions inspected. Compilation cutoff is 1 May 2026. No assertion that every subsequent decision or amendment was reviewed.
- Parliamentary handbook and FAQ: relevant procedure descriptions inspected. Historical rosters, outdated office-holder references and conflicting exact timing statements were not reused.
- Procurement: the live directory establishes listed editions. The central Goods 2024 manual's cited sections were inspected, using its copy on IIT Kanpur's public-institution host. The Works 2025 listing is not a claim that its whole text was inspected. State/local contracts need their own rulebook.
- AQI: original framework and official explanatory concept note inspected. No current pollution observations or individual health advice is inferred.
- Candidate expenses: only sections 76–78 from the CEO-hosted statutory compilation support the record distinction. No current spending ceiling, filing deadline or outdated bond exemption is extracted.
- Consultation policy: official-origin text inspected on an explicitly labelled third-party mirror because the official landing page did not provide readable policy text. PDF policy pages 2 and 3 were visually checked.
- ASER: the original survey producer's basic-method explanation is used, not a fabricated new result or a claim that the rural basic survey covers all urban children.
- Impact evaluation: original World Bank/IDB method text supports counterfactual and comparison assumptions. All new numerical examples are labelled hypothetical.
- SIFT: the author's original method post supports tracing context. Comments, popularity metrics and search snippets are not supporting evidence.

Inaccessible or unread material is not attached to claims as though it had been examined. Sources were accessed through web retrieval; there is no invented container download archive. Full reports are not rehosted.

## What the checks do

The 82 passage associations connect cited article passages to their source locators. They are not a claim that every interpretive sentence is a direct quotation, or that a software program established its truth. Hypothetical examples are explicitly marked in the prose and synthetic data asset.

The local validator checks source mappings, file parity, row provenance and arithmetic. The importer was tested against the supplied v2 content root, not the user’s deployed repository. The package contains no independent human sign-off and creates no monitoring or publication automation.

## Updating this release later

A new statistical edition should receive a new dated source record and a revision note; do not overwrite a historical value without preserving its release status. A changed definition or GDP series requires a comparison break or explicit variant. Legal and procedural updates need the actual applicable instrument, not a fresh website footer date. Preserve the evidence note that explains the change.
