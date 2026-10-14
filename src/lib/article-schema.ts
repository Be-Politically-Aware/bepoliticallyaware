import { z } from "astro/zod";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const source = z.object({
  number: z.number().int().positive(),
  ref_id: z.string().min(1),
  document_id: z.string().min(1),
  title: z.string().min(1),
  publisher: z.string().min(1),
  url: z.url(),
  locator: z.string().min(1),
  version: z.string().nullable(),
  published_at: z.string().nullable(),
  reference_period: z.string().nullable(),
  checked_at: date,
  limitations: z.array(z.string()),
  kind: z.enum([
    "official_primary",
    "official_primary_mirror",
    "independent_primary_analysis",
    "method_author_primary",
    "publisher_own_standards",
  ]),
});

export const articleSchema = z.object({
  id: z.string().min(1),
  route: z.string().startsWith("/in/"),
  country: z.literal("IN"),
  language: z.literal("en"),
  hub: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  kind: z.string().min(1),
  status: z.enum(["ready", "planned", "blocked", "retired"]),
  publish: z.boolean(),
  research_checked_at: date,
  version: z.string().min(1),
  human_reviewed: z.literal(false),
  review_method: z.string().min(1),
  jurisdiction: z.string().min(1),
  legal_scope: z.string().min(1),
  reader_task: z.string().min(1),
  related_ids: z.array(z.string()),
  source_ref_ids: z.array(z.string()),
  sources: z.array(source),
  data_ids: z.array(z.string()).optional(),
  release_batch: z.string().optional(),
  content_sha256: z.string().optional(),
  word_count: z.number().int().positive().optional(),
  launch_order: z.number().int().positive().nullable(),
  quiz: z
    .object({
      question: z.string(),
      options: z.array(z.string()),
      answer_index: z.number().int().nonnegative(),
      explanation: z.string(),
    })
    .nullable(),
  maintenance: z.object({
    trigger: z.string(),
    suggested_recheck_days: z.number().positive(),
    automation_created: z.literal(false),
  }),
});
