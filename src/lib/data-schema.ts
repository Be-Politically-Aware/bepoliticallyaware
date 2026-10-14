import { z } from "astro/zod";

export const dataSchema = z.looseObject({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  asset_type: z.enum([
    "official_statistics",
    "reference_table",
    "synthetic_teaching_example",
  ]),
  synthetic: z.boolean(),
  is_live: z.literal(false),
  checked_at: z.string(),
  reference_period: z.string(),
  source_ref_ids: z.array(z.string()),
  limitations: z.array(z.string()),
  tables: z.array(
    z.looseObject({
      id: z.string(),
      title: z.string(),
      columns: z.array(z.string()),
      rows: z.array(
        z.record(
          z.string(),
          z.union([z.string(), z.number(), z.boolean(), z.null()]),
        ),
      ),
      row_count: z.number().int(),
      csv_path: z.string().startsWith("content/csv/"),
    }),
  ),
});
export type DataAsset = z.infer<typeof dataSchema>;
