# Data dictionary

Four statistical assets contain 327 published observations. Two reference assets and one synthetic asset are separately labelled. Eleven CSV files provide flat copies of all tables.

JSON is canonical. CSV empty cells mean null or not applicable, never zero. Booleans are written as `True`/`False` by the standard Python CSV exporter. Treat source IDs and codes such as `01` as text.

## Shared fields

| Field | Meaning |
|---|---|
| `checked_at` | Date the source evidence was checked for this release; not continuous monitoring |
| `published_at` | Publication date where established; null or partial text is preserved |
| `reference_period` / row period | The period the evidence describes, separate from publication |
| `source_ref_id`, `source_url`, `source_locator` | Original supporting document and exact table/section |
| `unit`, `measure`, `denominator` | What the number measures; do not combine incompatible measures |
| `release_status`, `accounting_stage`, `series_variant` | Provisional/final, BE/RE/Actual or denominator variant |
| `asset_type`, `synthetic`, `is_live` | Distinguish actual observations, reference guidance and invented teaching examples |

## Consumer prices: September 2026

**ID:** `v3-cpi-september-2026` · **Type:** `official_statistics` · **Rows:** 96

Published headline CPI/CFPI and division-level indices and year-on-year rates.

**Reference period:** August 2026 final and September 2026 provisional

### CPI and CFPI headline observations (24 rows)

CSV: [v3-cpi-september-2026--headline.csv](content/csv/v3-cpi-september-2026--headline.csv)

`period`, `release_status`, `series`, `sector`, `measure`, `value`, `unit`, `base_year`, `geography`, `source_ref_id`, `source_url`, `source_locator`, `published_at`, `checked_at`

### Division-level September observations (72 rows)

CSV: [v3-cpi-september-2026--divisions.csv](content/csv/v3-cpi-september-2026--divisions.csv)

`period`, `release_status`, `division_code`, `division_name`, `sector`, `measure`, `value`, `unit`, `base_year`, `geography`, `source_ref_id`, `source_url`, `source_locator`, `published_at`, `checked_at`

**Interpretation limits:**

- September 2026 is provisional in this release; August is final. Historical release snapshot, not an automatically updating feed.
- Year-on-year percentage rates are not monthly changes. Combined is not a simple mean of rural and urban.
- CFPI is not interchangeable with the Food and beverages division. Preserve division code 13; no code 12 is supplied in the source table.
- No state-level, item-level or group-level dataset is claimed here. No causal attribution is encoded.

**Reproducible calculations:**

- `5.54 - 4.83` = 0.71 percentage_points.

## School education: UDISE+ 2025–26 release tables

**ID:** `v3-udise-2025-26` · **Type:** `official_statistics` · **Rows:** 128

32 reported indicators across four academic years.

**Reference period:** Academic years 2022–23 through 2025–26

### Reported national school indicators (128 rows)

CSV: [v3-udise-2025-26--indicators.csv](content/csv/v3-udise-2025-26--indicators.csv)

`indicator_id`, `indicator`, `stage`, `academic_year`, `value`, `unit`, `geography`, `series_basis`, `status`, `denominator_note`, `source_ref_id`, `source_url`, `source_locator`, `published_at`, `checked_at`

**Interpretation limits:**

- Source is the original ministry release and its tables, not the inaccessible full national-report PDFs.
- Administrative reporting does not independently establish daily facility functionality or student learning.
- The narrative overstates uniform dropout decline: the middle-stage table increases from 3.5 to 3.6 in the last two years. Values are preserved.
- NEP-stage labels are retained. Do not silently splice older stage definitions or infer indicator formulas absent the full methodology.
- School availability percentages have their published indicator denominators; do not convert to counts using an unrelated school total.

**Reproducible calculations:**

- `7.0 - 8.2` = -1.2 percentage_points.
- `3.6 - 3.5` = 0.1 percentage_points.

## Health financing: selected NHA 2022–23 comparisons

**ID:** `v3-nha-2022-23` · **Type:** `official_statistics` · **Rows:** 15

Fifteen selected observations with denominator and GDP-series distinctions.

**Reference period:** Selected financial years 2013–14, 2021–22 and 2022–23

### Selected health-financing observations (15 rows)

CSV: [v3-nha-2022-23--observations.csv](content/csv/v3-nha-2022-23--observations.csv)

`indicator_id`, `financial_year`, `value`, `unit`, `denominator`, `series_variant`, `price_basis`, `rounded_amount`, `geography`, `status`, `source_ref_id`, `source_url`, `source_locator`, `published_at`, `checked_at`

**Interpretation limits:**

- Official release inspected; full NHA report not retrieved. Figures do not describe all health services in 2026.
- 1.43% and 1.48% are alternative FY 2022–23 GDP ratios, not sequential spending increases.
- Amounts in lakh crore are rounded as published; do not display invented rupee-level precision.
- OOPE is a share of total health expenditure, not a percentage of household income or proof that each household paid less.
- The long-run OOPE-share fall coexists with a rise from 2021–22 to 2022–23.

**Reproducible calculations:**

- `43.4 - 64.2` = -20.8 percentage_points.
- `43.4 - 39.4` = 4.0 percentage_points.

## Union Budget 2026–27: receipts, expenditure and deficits

**ID:** `v3-union-budget-receipts-deficits` · **Type:** `official_statistics` · **Rows:** 88

Main-table amounts and published deficit-to-GDP ratios, with accounting stages preserved.

**Reference period:** FY 2024–25 actual; FY 2025–26 BE/RE; FY 2026–27 BE

### Main budget table: rupees in crore (72 rows)

CSV: [v3-union-budget-receipts-deficits--amounts.csv](content/csv/v3-union-budget-receipts-deficits--amounts.csv)

`indicator_id`, `indicator`, `financial_year`, `accounting_stage`, `value`, `unit`, `geography`, `price_basis`, `note`, `source_ref_id`, `source_url`, `source_locator`, `published_at`, `checked_at`

### Published deficit ratios (16 rows)

CSV: [v3-union-budget-receipts-deficits--gdp-ratios.csv](content/csv/v3-union-budget-receipts-deficits--gdp-ratios.csv)

`indicator_id`, `financial_year`, `accounting_stage`, `value`, `unit`, `geography`, `denominator`, `source_ref_id`, `source_url`, `source_locator`, `published_at`, `checked_at`

**Interpretation limits:**

- This is a historical budget-document snapshot, not actual FY 2026–27 spending and not combined Union/state finances.
- Subtotal and component rows overlap; never sum all rows.
- Published rounding creates small differences, including a two-crore residual when reconstructing FY 2024–25 fiscal deficit from several rounded rows. Original totals are retained.
- Borrowings and other liabilities includes cash-balance drawdown. The rupee-source infographic includes states’ tax share and has a different presentation from net-Centre receipts.
- FY 2025–26 RE net tax receipts includes the source footnote’s prior-year adjustment of ₹9,084 crore.
- The budget assumes nominal GDP ₹393,00,393 crore for FY 2026–27, versus ₹357,13,886 crore in the FY 2025–26 advance estimate. Its 10% comparison is nominal, not real growth.

**Reproducible calculations:**

- `1695768 - 1403972` = 291796 INR_crore.
- `1695768 - 1558492` = 137276 INR_crore.
- `4.3 - 4.4` = -0.1 percentage_points.

## Indian AQI category reference

**ID:** `v3-india-aqi-reference` · **Type:** `reference_table` · **Rows:** 6

Six published categories, not live city readings.

**Reference period:** 2014 classification framework, corroborated with official concept note

### AQI reference categories (6 rows)

CSV: [v3-india-aqi-reference--categories.csv](content/csv/v3-india-aqi-reference--categories.csv)

`lower_bound`, `upper_bound`, `bounds`, `category`, `unit`, `reference_period`, `is_measurement`, `source_ref_id`, `source_url`, `source_locator`, `published_at`, `checked_at`

**Interpretation limits:**

- No monitor readings, pollutant concentrations or medical recommendations are included.
- This table is not an AQI calculator. Do not average pollutant indices or extrapolate a new category outside the published ranges.

## Political finance: record types and dated source events

**ID:** `v3-political-finance-records` · **Type:** `reference_table` · **Rows:** 8

A source-navigation and interpretation asset, not a donor/party money dataset.

**Reference period:** Selected 2023–2024 source events; record-specific periods must be checked

### Financial records and their limits (5 rows)

CSV: [v3-political-finance-records--record-types.csv](content/csv/v3-political-finance-records--record-types.csv)

`record_type_id`, `record_type`, `scope`, `does_not_establish`, `reference_period`, `source_ref_id`, `source_url`, `source_locator`, `published_at`, `checked_at`

### Selected historical source events (3 rows)

CSV: [v3-political-finance-records--events.csv](content/csv/v3-political-finance-records--events.csv)

`event_date`, `event`, `interpretation_limit`, `source_ref_id`, `source_url`, `source_locator`, `published_at`, `checked_at`

**Interpretation limits:**

- No donor totals, party rankings, suspicious-transaction matching or guilt scores are generated.
- The three source events are selected historical context, not a complete chronology or live case-status tracker.
- No underlying party filing or electoral-bond transaction file is represented as audited.

## Teaching examples: real spending and causal comparisons

**ID:** `v3-teaching-calculations` · **Type:** `synthetic_teaching_example` · **Rows:** 6

Invented inputs with executable arithmetic. Never chart as observed Indian data.

**Reference period:** Invented Year A/Year B and before/after periods; not calendar observations

### Hypothetical spending inputs (2 rows)

CSV: [v3-teaching-calculations--spending-inputs.csv](content/csv/v3-teaching-calculations--spending-inputs.csv)

`example_id`, `period`, `nominal_spending_INR_crore`, `price_index`, `population`, `synthetic`, `source_ref_id`, `source_url`, `source_locator`, `published_at`, `checked_at`

### Hypothetical absence rates (4 rows)

CSV: [v3-teaching-calculations--causal-inputs.csv](content/csv/v3-teaching-calculations--causal-inputs.csv)

`example_id`, `group`, `period`, `absence_rate_percent`, `synthetic`, `source_ref_id`, `source_url`, `source_locator`, `published_at`, `checked_at`, `data_origin`

**Interpretation limits:**

- All numerical inputs in this asset are invented for teaching.
- The difference-in-differences arithmetic is not a valid causal estimate unless its assumptions are justified for actual data.
- An appropriate deflator and population are needed for a real spending-per-person analysis.

**Reproducible calculations:**

- `(110 / 100 - 1) * 100` = 10.0 percent.
- `110 * 100 / 108` = 101.85185185185185 INR_crore_in_Year_A_prices.
- `((110 / 100) / (108 / 100) - 1) * 100` = 1.85185185185186 percent.
- `((110 / 100) / (108 / 100) / (105000 / 100000) - 1) * 100` = -2.998236331569659 percent.
- `(12 - 20) - (14 - 18)` = -4.0 percentage_points.

## Charting rules

For CPI, select one measure and sector per comparison, show the base year, and retain provisional/final labels. Do not average rural and urban to invent a combined result.

For school indicators, preserve NEP-stage labels and the academic year. Do not infer pupil learning from facility availability. Indicator definitions beyond the release were not reconstructed.

For NHA, separate GDP-series variants for the same year. Do not connect the two 2022–23 GDP ratios into a time series. Label OOPE/THE correctly, and keep both long-run decline and the recent increase visible.

For the budget, retain BE, RE and Actual and never sum all rows: many rows are subtotals or components. Preserve the original rounded amounts and disclose arithmetic residuals rather than altering published values.

Reference categories and synthetic teaching examples must be visually identified as such. AQI categories are not city readings. Political-finance record types are not party/donor amounts.
