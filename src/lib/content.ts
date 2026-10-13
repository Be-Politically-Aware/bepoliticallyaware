import { getCollection } from "astro:content";
import navigation from "../../content/navigation.json";
import copy from "../../content/site-copy.json";
import glossary from "../../content/glossary.json";
import sourceDirectory from "../../content/sources.json";

export { navigation, copy, glossary, sourceDirectory };
const entries = await getCollection(
  "articles",
  ({ data }) => data.status === "ready" && data.publish,
);
const entryById = new Map(entries.map((entry) => [entry.data.id, entry]));
const order = navigation.hubs.flatMap((hub) => hub.article_ids);
export const articles = entries
  .sort((a, b) => order.indexOf(a.data.id) - order.indexOf(b.data.id))
  .map((entry) => ({
    ...entry.data,
    entry,
    estimated_reading_minutes: Math.max(
      1,
      Math.ceil(
        [
          ...(entry.body ?? "")
            .replace(/\([^)]*https?[^)]*\)/g, "")
            .matchAll(/[\p{L}\p{N}_]+(?:[’'-]+[\p{L}\p{N}_]+)*/gu),
        ].length / 200,
      ),
    ),
    related: entry.data.related_ids.map((id) => {
      const related = entryById.get(id);
      if (!related)
        throw new Error(`${entry.id}: related article ${id} is not published.`);
      return { id, title: related.data.title, route: related.data.route };
    }),
  }));
export type Article = (typeof articles)[number];
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
