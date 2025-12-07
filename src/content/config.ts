import { defineCollection, z } from "astro:content";
const infopages = defineCollection({
  schema: z.object({
    page: z.string(),
    pubDate: z.date(),
  }),
});
const authors = defineCollection({
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string().optional(),
      bio: z.string().optional(),
      image: z.object({
        url: image(), // ← Astro's image helper for optimization
        alt: z.string(),
      }),
      socials: z
        .object({
          twitter: z.string().optional(),
          website: z.string().optional(),
          linkedin: z.string().optional(),
          email: z.string().optional(),
        })
        .optional(),
    }),
});

const posts = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      author: z.string(),
      image: z.object({
        url: image(), // ← use the helper here
        alt: z.string(),
      }),
      tags: z.array(z.string()),
      isBreaking: z.boolean().optional(),
      isTopStory: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      isBrief: z.boolean().optional(),
      isLocked: z.boolean().optional(),
    }),
});

const podcasts = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      author: z.string(),
      image: z.object({
        url: image(), // ← Use Astro's image helper
        alt: z.string(),
      }),
      episodeNumber: z.number().optional(),
      duration: z.string().optional(),
      audioSrc: z.string().optional(),
      tags: z.array(z.string()),
      isFeatured: z.boolean().optional(),
      isGuest: z.boolean().optional(),
      isSeries: z.boolean().optional(),
      isLocked: z.boolean().optional(),
    }),
});

const jobs = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    jobType: z.string(),
    company: z.string(),
    location: z.string(),
    category: z.string(),
    jobLevel: z.string(),
    experience: z.string(),
    salaryRange: z.string(),
    description: z.string(),
    benefits: z.array(z.string()),
    employmentStatus: z.string(),
    requirements: z.array(z.string()),
    salaryType: z.string().optional(),
    referenceId: z.string().optional(),
    contactEmail: z.string().optional(),
    responsibilities: z.array(z.string()),
    hiringManager: z.string().optional(),
    companyCulture: z.string().optional(),
    perks: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    workEnvironment: z.string().optional(),
    applicationDeadline: z.date().optional(),
    mediaLinks: z.array(z.string()).optional(),
    applicationInstructions: z.string().optional(),
  }),
});
const helpCenter = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
  }),
});
export const collections = {
  authors: authors,
  infopages: infopages,
  posts: posts,
  podcast: podcasts,
  jobs: jobs,
  helpCenter: helpCenter,
};
