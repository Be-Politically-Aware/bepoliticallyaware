import bundle from "../../content/articles.json";
import navigation from "../../content/navigation.json";
import copy from "../../content/site-copy.json";
import glossary from "../../content/glossary.json";
import sourceDirectory from "../../content/sources.json";
import type { Article } from "../../implementation/content-types";

export { navigation, copy, glossary, sourceDirectory };
export const articles = (bundle.articles as Article[]).filter(
  (a) => a.status === "ready" && a.publish === true,
);
export const byId = new Map(articles.map((a) => [a.id, a]));
export const sections = [
  ...navigation.primary.map((p) => ({
    ...p,
    description: "",
    articles: articles.filter((a) => p.hubs.includes(a.hub)),
  })),
  ...navigation.hubs
    .filter((h) => !navigation.primary.some((p) => p.route === h.route))
    .map((h) => ({
      label: h.label,
      route: h.route,
      hubs: [h.id],
      description: "",
      articles: h.article_ids.flatMap((id) => byId.get(id) ?? []),
    })),
];
export const paths = navigation.reading_paths.map((p) => ({
  ...p,
  route: `/in/paths/${p.id}`,
  articles: p.article_ids.flatMap((id) => byId.get(id) ?? []),
}));
export function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
