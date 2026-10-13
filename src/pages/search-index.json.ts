import type { APIRoute } from "astro";
import { articles } from "../lib/content";
import { plainText } from "../lib/markdown";
export const GET = (() => {
  return Response.json(
    articles.map((a) => ({
      route: a.route,
      title: a.title,
      summary: a.summary,
      text: plainText(a.body_markdown),
      hub: a.hub,
    })),
  );
}) satisfies APIRoute;
