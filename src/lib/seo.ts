import { articles, copy, paths, sections } from "./content";
import { getNavigation } from "./nav";

export const seoPages = [
  { route: "/", title: copy.site_name, description: copy.hero.description },
  {
    route: "/in",
    title: "India guides",
    description:
      "Understand politics in India: who has the power, how public decisions affect your life, and how to check the evidence.",
  },
  {
    route: "/in/paths",
    title: "Reading paths",
    description:
      "Short sequences of guides, each starting from a common question. Learn about public institutions, elections and evidence at your own pace.",
  },
  {
    route: "/sources",
    title: "Source directory",
    description:
      "The documents behind the guides. Find original sources, editions and limitations; exact claim locators are listed on each article.",
  },
  ...articles.map((article) => ({
    route: article.route,
    title: article.title,
    description: article.summary,
  })),
  ...sections.map((section) => ({
    route: section.route,
    title: section.label,
    description: `${section.label}: ${section.articles.length} source-linked guides, with clear explanations, original sources and practical next steps.`,
  })),
  ...paths.map((path) => ({
    route: path.route,
    title: path.title,
    description: path.outcome,
  })),
];
export type SeoPage = (typeof seoPages)[number];

export function ogImagePath(route: string) {
  return `/og/${route === "/" ? "index" : route.slice(1)}.png`;
}

export function breadcrumbs(route: string) {
  const items = [{ route: "/", title: copy.site_name }];
  if (route === "/") return items;
  if (route.startsWith("/in")) items.push({ route: "/in", title: "India" });
  if (route.startsWith("/in/paths/"))
    items.push({ route: "/in/paths", title: "Reading paths" });
  const { section, hub } = getNavigation(route);
  for (const parent of [section, hub]) {
    if (
      parent &&
      parent.route !== route &&
      !items.some((item) => item.route === parent.route)
    )
      items.push({ route: parent.route, title: parent.label });
  }
  const page = seoPages.find((page) => page.route === route)!;
  if (!items.some((item) => item.route === route)) items.push(page);
  return items;
}

export function structuredData(page: SeoPage, site: URL) {
  const canonical = new URL(page.route, site).href;
  const article = articles.find((article) => article.route === page.route);
  const websiteId = new URL("/#website", site).href;
  const pageId = `${canonical}#webpage`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.href,
        name: copy.site_name,
        inLanguage: "en-IN",
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url: canonical,
        name: page.title,
        description: page.description,
        inLanguage: "en-IN",
        isPartOf: { "@id": websiteId },
        breadcrumb: { "@id": `${canonical}#breadcrumb` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: new URL(ogImagePath(page.route), site).href,
          width: 1200,
          height: 630,
        },
        ...(article ? { mainEntity: { "@id": `${canonical}#article` } } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: breadcrumbs(page.route).map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          item: new URL(item.route, site).href,
        })),
      },
      ...(article
        ? [
            {
              "@type": "Article",
              "@id": `${canonical}#article`,
              headline: article.title,
              description: article.summary,
              inLanguage: "en-IN",
              mainEntityOfPage: { "@id": pageId },
              image: new URL(ogImagePath(page.route), site).href,
              articleSection: getNavigation(page.route).section!.label,
              citation: article.sources.map((source) => source.url),
            },
          ]
        : []),
    ],
  };
}
