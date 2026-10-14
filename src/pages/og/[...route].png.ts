import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { ogImagePath, seoPages } from "../../lib/seo";
import { renderOgPng } from "../../lib/og-image";

export const getStaticPaths = (() =>
  seoPages.map((page) => ({
    params: { route: ogImagePath(page.route).slice(4, -4) },
    props: { page },
  }))) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
export const GET = (async ({ props }) => {
  const png = await renderOgPng(props.page);
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}) satisfies APIRoute<Props>;
