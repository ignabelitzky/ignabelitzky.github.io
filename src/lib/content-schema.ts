import { z } from 'astro/zod';

const nonempty = z.string().trim().min(1);
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const recordingSchema = z.url().refine((value) => {
  const url = new URL(value);
  return (
    url.protocol === 'https:' &&
    !url.username &&
    !url.password &&
    !url.hash &&
    ((url.hostname === 'youtu.be' && /^\/[\w-]{11}$/.test(url.pathname)) ||
      (url.hostname === 'www.youtube.com' &&
        url.pathname === '/watch' &&
        /^[\w-]{11}$/.test(url.searchParams.get('v') ?? '')))
  );
}, 'Use a repository-linked YouTube recording');
export const localizedProjectSchema = z
  .object({
    summary: nonempty,
    context: nonempty.optional(),
    features: z.array(nonempty).default([]),
    engineeringFocus: nonempty.optional(),
    role: nonempty.optional(),
  })
  .strict();

export const projectSchema = z
  .object({
    slug: slugSchema,
    name: nonempty,
    category: z.enum(['desktop', 'graphics', 'tools', 'web', 'experiments', 'research']),
    order: z.number().int().positive(),
    featured: z.boolean().default(false),
    treatment: z.enum(['neutral', 'inverse', 'soft']).default('neutral'),
    source: z.url().refine((value) => {
      const url = new URL(value);
      return (
        url.origin === 'https://github.com' &&
        !url.username &&
        !url.password &&
        !url.search &&
        !url.hash &&
        /^\/ignabelitzky\/[A-Za-z0-9_.-]+\/?$/.test(url.pathname)
      );
    }, 'Use the approved public GitHub project source'),
    website: z
      .url()
      .refine((value) => {
        const url = new URL(value);
        return (
          url.origin === 'https://www.veterinariadacor.com' &&
          !url.username &&
          !url.password &&
          !url.search &&
          !url.hash &&
          url.pathname === '/'
        );
      }, 'Use the approved HTTPS DACOR website')
      .optional(),
    technologies: z.array(nonempty).min(1),
    recording: recordingSchema.optional(),
    research: z
      .object({
        title: z.literal('The problem of relaxation to equilibrium'),
        preprint: z.literal('https://arxiv.org/html/2605.16417v1'),
        authors: z.tuple([
          z.literal('Silvina Limandri'),
          z.literal('Silvina Segui'),
          z.literal('Bruno Castellano'),
          z.literal('Ignacio Belitzky'),
          z.literal('Gustavo Castellano'),
        ]),
      })
      .strict()
      .optional(),
    translations: z.object({ en: localizedProjectSchema, es: localizedProjectSchema }).strict(),
  })
  .strict();

export type ProjectData = z.infer<typeof projectSchema>;

export const experimentSchema = z
  .object({
    slug: slugSchema,
    name: nonempty,
    order: z.number().int().positive(),
    status: z.enum(['highlight', 'experimental', 'prototype']),
    source: z.url(),
    technologies: z.array(nonempty).min(1),
    recording: recordingSchema.optional(),
    combinedRecording: z.boolean().default(false),
    translations: z
      .object({
        en: z.object({ summary: nonempty }).strict(),
        es: z.object({ summary: nonempty }).strict(),
      })
      .strict(),
  })
  .strict()
  .refine(
    (entry) =>
      entry.source === `https://github.com/ignabelitzky/tiny-programs/tree/main/${entry.slug}`,
    'Link to the matching public experiment directory',
  );

export const articleSchema = z
  .object({
    slug: slugSchema,
    translationKey: slugSchema,
    locale: z.enum(['en', 'es']),
    title: nonempty,
    description: nonempty,
    author: z.literal('Ignacio Belitzky'),
    pubDate: z.iso.date().transform((value) => new Date(`${value}T00:00:00Z`)),
    updatedDate: z.iso
      .date()
      .transform((value) => new Date(`${value}T00:00:00Z`))
      .optional(),
    draft: z.boolean().default(true),
    tags: z.array(nonempty).default([]),
  })
  .strict()
  .refine(
    (entry) => !entry.updatedDate || entry.updatedDate >= entry.pubDate,
    'Updated date must not precede publication',
  );
export type ArticleData = z.infer<typeof articleSchema>;
