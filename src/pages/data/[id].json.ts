import { evidence } from "../../lib/evidence";
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
export const getStaticPaths = (() => {
  return evidence.map((card) => ({
    params: { id: card.data.id },
    props: { data: card.data },
  }));
}) satisfies GetStaticPaths;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;
export const GET = (({ props }) => {
  return Response.json(props.data);
}) satisfies APIRoute<Props>;
