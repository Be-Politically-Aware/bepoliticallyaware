/** Framework-independent types for the supplied JSON; no runtime dependency. */
export interface SourceReference {
  number: number;
  ref_id: string;
  document_id: string;
  title: string;
  publisher: string;
  url: string;
  locator: string;
  version: string | null;
  published_at: string | null;
  reference_period: string | null;
  checked_at: string;
  limitations: string[];
  kind: "official_primary" | "independent_primary_analysis" | "method_author_primary" | "publisher_own_standards";
}

export interface Article {
  id: string;
  route: string;
  country: "IN";
  language: "en";
  hub: string;
  title: string;
  summary: string;
  kind: string;
  status: "ready" | "planned" | "blocked" | "retired";
  publish: boolean;
  research_checked_at: string;
  version: string;
  body_markdown: string;
  reader_task: string;
  related_ids: string[];
  related: Array<{ id: string; route: string; title: string }>;
  source_ref_ids: string[];
  sources: SourceReference[];
  estimated_reading_minutes: number;
  word_count: number;
  human_reviewed: boolean;
  content_sha256: string;
  launch_order: number | null;
  quiz: null | { question: string; options: string[]; answer_index: number; explanation: string };
  maintenance: { trigger: string; suggested_recheck_days: number; automation_created: false };
}

export interface ContentBundle {
  schema_version: string;
  research_checked_at: string;
  article_count: number;
  articles: Article[];
}

/** Filter both status and explicit publication permission. */
export function publishedArticles(bundle: ContentBundle): Article[] {
  return bundle.articles.filter((article) => article.status === "ready" && article.publish === true);
}
