import { getCollection, type CollectionEntry } from 'astro:content';

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function tagPath(tag: string): string {
  return `/writing/tags/${tagSlug(tag)}/`;
}

export async function publishedWriting(): Promise<CollectionEntry<'writing'>[]> {
  const entries = await getCollection('writing', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export async function publishedIdeas(): Promise<CollectionEntry<'ideas'>[]> {
  const entries = await getCollection('ideas');
  return entries.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export async function publishedProjects(): Promise<CollectionEntry<'projects'>[]> {
  const entries = await getCollection('projects');
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function writingTags(): Promise<{ slug: string; label: string; count: number }[]> {
  const posts = await publishedWriting();
  const tags = new Map<string, { slug: string; label: string; count: number }>();
  for (const post of posts) {
    for (const label of post.data.tags) {
      const slug = tagSlug(label);
      const existing = tags.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        tags.set(slug, { slug, label, count: 1 });
      }
    }
  }
  return [...tags.values()].sort((a, b) => a.label.localeCompare(b.label));
}
