import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { projectStatuses } from './lib/projects';
import { ideaTags } from './lib/ideas';

const day = z.union([z.string(), z.date()]).transform((value) => {
  if (value instanceof Date) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, '0');
    const date = String(value.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  }
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value.trim());
  if (!match?.[1]) {
    throw new Error(`Expected a YYYY-MM-DD date, received ${value}`);
  }
  return match[1];
});

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected a YYYY-MM month');

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(20),
    date: day,
    tags: z.array(z.string().min(1)).default([]),
    draft: z.boolean().default(false),
    // Homepage writing list. Chronology on /writing/ is unchanged.
    featured: z.boolean().default(true),
    featuredEssay: z.boolean().default(false),
    series: z.string().min(1).optional(),
    seriesOrder: z.number().int().positive().optional(),
    hero: z
      .object({
        src: z.string().startsWith('/'),
        alt: z.string().min(1),
        caption: z.string().min(1).optional(),
      })
      .optional(),
  }),
});

const ideas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ideas' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(20),
    date: day,
    developed: month,
    tags: z.array(z.enum(ideaTags)).min(1).max(3),
    // Site paths of the essays and work entries this idea grew out of or feeds.
    related: z.array(z.string().regex(/^\/(writing|work|ideas)\/[a-z0-9-]+\/$/)).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(20),
    date: day,
    status: z.enum(projectStatuses),
    kind: z.enum(['independent', 'public', 'research']).default('research'),
    role: z.string().min(1),
    featured: z.boolean().default(false),
    order: z.number().int(),
    links: z
      .array(
        z.object({
          label: z.string().min(1),
          href: z.url(),
        }),
      )
      .default([]),
  }),
});

export const collections = { writing, ideas, projects };
