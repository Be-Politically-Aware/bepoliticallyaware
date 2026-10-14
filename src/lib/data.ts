import { dataSchema } from "./data-schema";

const assets = import.meta.glob("../../content/data/v3-*.json", {
  eager: true,
  import: "default",
});
export const dataAssets = Object.values(assets).map((asset) =>
  dataSchema.parse(asset),
);

export const dataLabels = {
  official_statistics:
    "Official statistics — dated observations, not a live feed.",
  reference_table:
    "Reference table — not observed measurements or a live feed.",
  synthetic_teaching_example:
    "Hypothetical teaching example — invented inputs, not observed Indian data.",
};
