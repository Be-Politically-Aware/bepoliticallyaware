import { articles, sections, paths } from "../lib/content";
export function GET() {
  const routes = [
    "/",
    "/in",
    "/in/paths",
    "/sources",
    ...articles.map((a) => a.route),
    ...sections.map((s) => s.route),
    ...paths.map((p) => p.route),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>https://bepoliticallyaware.org${route}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
