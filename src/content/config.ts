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
  }),
});

export const collections = { blog };
