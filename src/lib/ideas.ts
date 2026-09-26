export const ideaTags = ['Agents', 'Governance', 'Systems', 'Local AI', 'Product', 'Economics'] as const;

export type IdeaTag = (typeof ideaTags)[number];

export function ideaTagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function ideaTagPath(tag: string): string {
  return `/ideas/?tag=${encodeURIComponent(ideaTagSlug(tag))}`;
}
