import type { APIRoute } from "astro";
import { seoPages } from "../lib/seo";
export const GET = (({ site }) => {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${seoPages.map((page) => `<url><loc>${new URL(page.route, site)}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}) satisfies APIRoute;
