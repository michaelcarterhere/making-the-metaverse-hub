import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fetch from "node-fetch";
import { XMLParser } from "fast-xml-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 Your actual RSS feed
const RSS_URL = "https://anchor.fm/s/832948c4/podcast/rss";

// Where to write the markdown files
const OUT_DIR = path.join(__dirname, "..", "src", "content", "podcast");

// Helper to escape for YAML string values in double quotes
const esc = (s = "") => JSON.stringify(s).slice(1, -1);

// Strip HTML tags for summary
const stripHtml = (html = "") =>
  html.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, " ").trim();

// Build a short summary for description:
const makeSummary = (html = "", maxLen = 240) => {
  const text = stripHtml(html);
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

async function main() {
  console.log("Fetching RSS feed from:", RSS_URL);
  const res = await fetch(RSS_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch RSS: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();

  console.log("Parsing RSS…");
  const data = parser.parse(xml);

  const channel = data?.rss?.channel;
  if (!channel) {
    console.error("Could not find rss.channel in parsed data.");
    process.exit(1);
  }

  let items = channel.item;
  if (!items) {
    console.error("No <item> entries found in RSS feed.");
    process.exit(1);
  }
  if (!Array.isArray(items)) {
    items = [items];
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  console.log(`Found ${items.length} episodes. Generating markdown…`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const rawTitle = item.title?.trim() || `Episode ${i + 1}`;
    const title = rawTitle;

    // Full HTML show notes from RSS
    const rawDescHtml =
      (item["itunes:summary"] || item.description || "").trim();

    // Short plain-text summary for frontmatter
    const summary = makeSummary(rawDescHtml);

    // pubDate → YYYY-MM-DD
    let pubDate = "2025-01-01";
    if (item.pubDate) {
      const d = new Date(item.pubDate);
      if (!isNaN(d.getTime())) {
        pubDate = d.toISOString().split("T")[0];
      }
    }

    const durationRaw = item["itunes:duration"] || "";
    const duration = durationRaw ? durationRaw : "";

    const episodeNumber = Number(item["itunes:episode"] || i + 1);

    const audioSrc = item.enclosure?.url || "";

    const imageUrl =
      item["itunes:image"]?.href ||
      channel["itunes:image"]?.href ||
      "/src/images/podcastThumbnails/default.jpeg";

    const slugSafeTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const epPadded = String(episodeNumber).padStart(3, "0");
    const filename = `${epPadded}-${slugSafeTitle || "episode"}.md`;
    const filePath = path.join(OUT_DIR, filename);

    const frontmatter = `---
pubDate: ${pubDate}
duration: "${esc(duration)}"
episodeNumber: ${episodeNumber}
author: "michael-carter"
title: "${esc(title)}"
description: "${esc(summary)}"
image:
  url: "${esc(imageUrl)}"
  alt: "Episode cover for ${esc(title)}"
audioSrc: "${esc(audioSrc)}"
tags: []
isGuest: false
isFeatured: false
isLocked: false
isSeries: true
---

## Show Notes

${rawDescHtml || "Show notes coming soon."}

## Transcript

Transcript coming soon.
`;

    console.log(`Writing ${filename}`);
    await fs.writeFile(filePath, frontmatter, "utf8");
  }

  console.log("✅ Done! Episodes written to:", OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});