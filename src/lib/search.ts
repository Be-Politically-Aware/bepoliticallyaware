import MiniSearch from "minisearch";

export interface SearchEntry {
  route: string;
  title: string;
  summary: string;
  text: string;
  hub: string;
}
export function createSearch(entries: SearchEntry[]) {
  const index = new MiniSearch<SearchEntry>({
    idField: "route",
    fields: ["title", "summary", "text"],
    storeFields: ["route", "title", "summary", "text", "hub"],
    searchOptions: {
      boost: { title: 5, summary: 2 },
      prefix: true,
      fuzzy: (term) => (term.length > 4 ? 0.2 : false),
      combineWith: "AND",
    },
  });
  index.addAll(entries);
  return (query: string) =>
    query.trim()
      ? index.search(query).map((result) => ({
          route: result.route as string,
          title: result.title as string,
          summary: result.summary as string,
          text: result.text as string,
          hub: result.hub as string,
        }))
      : [];
}
