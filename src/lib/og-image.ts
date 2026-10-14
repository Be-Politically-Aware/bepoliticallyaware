import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fontData from "../assets/fonts/Geist-Medium.ttf?inline";
import { copy } from "./content";
import type { SeoPage } from "./seo";

const font = Buffer.from(fontData.split(",")[1]!, "base64");

export async function renderOgPng(page: SeoPage) {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#111614",
          color: "#e3eae6",
          padding: "56px 64px",
          fontFamily: "Geist",
          fontWeight: 500,
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#7cc4ae",
                fontSize: 24,
              },
              children: [
                { type: "div", props: { children: copy.site_name } },
                {
                  type: "div",
                  props: { style: { fontSize: 20 }, children: "India edition" },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                marginTop: 52,
                fontSize: page.title.length > 85 ? 46 : 58,
                lineHeight: 1.12,
                letterSpacing: "-0.035em",
              },
              children: page.title,
            },
          },
          {
            type: "div",
            props: {
              style: {
                marginTop: 24,
                fontSize: 26,
                lineHeight: 1.4,
                color: "#9aa8a2",
              },
              children:
                page.description.length > 180
                  ? `${page.description.slice(0, 177).trimEnd()}…`
                  : page.description,
            },
          },
          { type: "div", props: { style: { display: "flex", flex: 1 } } },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #46534d",
                paddingTop: 22,
                fontSize: 20,
                color: "#9aa8a2",
              },
              children: [
                {
                  type: "div",
                  props: { children: "Understand more. Ask better questions." },
                },
                { type: "div", props: { children: copy.domain } },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Geist", data: font, weight: 500, style: "normal" }],
    },
  );
  return new Resvg(svg, { font: { loadSystemFonts: false } }).render().asPng();
}
