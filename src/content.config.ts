import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    order: z.number(),
    images: z.array(z.object({ src: image(), alt: z.string().default('') })).default([]),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/home' }),
});

export const collections = { projects, home };
