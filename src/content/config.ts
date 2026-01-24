import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(['software', 'video']).optional(),
    date: z.date(),
    image: z.string().optional(),
    link: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
};