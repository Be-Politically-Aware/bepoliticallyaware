import { articles, byId, navigation } from "./content";

export const navSections = navigation.primary.map((section) => {
  const hubs = section.hubs.map((id) => {
    const hub = navigation.hubs.find((candidate) => candidate.id === id)!;
    return {
      ...hub,
      articles: hub.article_ids.flatMap((id) => byId.get(id) ?? []),
    };
  });
  return { ...section, hubs, articles: hubs.flatMap((hub) => hub.articles) };
});

export function getNavigation(route: string) {
  const article = articles.find((article) => article.route === route);
  const section = navSections.find(
    (section) =>
      section.route === route ||
      section.hubs.some(
        (hub) => hub.route === route || hub.id === article?.hub,
      ),
  );
  const hub = section?.hubs.find(
    (hub) => hub.route === route || hub.id === article?.hub,
  );
  return { section, hub, article };
}
