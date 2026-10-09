import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { projectSchema, experimentSchema, articleSchema } from './lib/content-schema.ts';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: ({ image }) =>
    projectSchema.extend({
      media: z
        .object({
          image: image(),
          alt: z.object({ en: z.string().min(1), es: z.string().min(1) }),
          credit: z.object({ en: z.string().min(1), es: z.string().min(1) }),
          provenance: z.url(),
          rightsConfirmed: z.literal(true),
        })
        .strict()
        .optional(),
    }),
});

const experiments = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/experiments' }),
  schema: experimentSchema,
});
const articles = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/articles',
    // Keep file IDs distinct: translated articles intentionally share a public slug.
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: articleSchema,
});
export const collections = { projects, experiments, articles };
