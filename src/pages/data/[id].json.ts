import { evidence } from "../../lib/evidence";
import type { APIContext } from "astro";
export function getStaticPaths() {
  return evidence.map((card) => ({
    params: { id: card.data.id },
    props: { data: card.data },
  }));
}
export function GET({ props }: APIContext) {
  return Response.json(props.data);
}
