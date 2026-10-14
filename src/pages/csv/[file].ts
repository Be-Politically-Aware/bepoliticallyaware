import { readFileSync } from "node:fs";
import { dataAssets } from "../../lib/data";
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";

export const getStaticPaths = (() =>
  dataAssets.flatMap((asset) =>
    asset.tables.map((table) => ({
      params: { file: table.csv_path.split("/").pop() },
      props: { csv: readFileSync(table.csv_path, "utf8") },
    })),
  )) satisfies GetStaticPaths;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;
export const GET = (({ props }) =>
  new Response(props.csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  })) satisfies APIRoute<Props>;
