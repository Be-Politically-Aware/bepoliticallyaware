import { evidence } from "../../lib/evidence";
import { dataAssets } from "../../lib/data";
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
export const getStaticPaths = (() => {
  return [...evidence.map((card) => card.data), ...dataAssets].map((data) => ({
    params: { id: data.id },
    props: { data },
  }));
}) satisfies GetStaticPaths;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;
export const GET = (({ props }) => {
  return Response.json(props.data);
}) satisfies APIRoute<Props>;
