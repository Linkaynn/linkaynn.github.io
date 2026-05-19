import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    readtime: z.string().default("5 min"),
    tags: z.array(z.string()).default([]),
    lang: z.enum(["es", "en"]),
    // Mark with `draft: true` in either language's frontmatter to hide the
    // post in production. Drafts are still served by `pnpm dev` so you can
    // preview them locally before publishing.
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
