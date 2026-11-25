import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("posts");
  const episodes = await getCollection("podcast");

  const items = [
    ...posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/posts/${post.slug}/`,
    })),
    ...episodes.map((episode) => ({
      title: episode.data.title,
      description: episode.data.description,
      pubDate: episode.data.pubDate,
      link: `/podcast/episodes/${episode.slug}/`,
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: "Making the Metaverse",
    description:
      "A podcast by Michael Carter about AI, virtual worlds, and the future of work.",
    site: context.site,
    items,
  });
}
