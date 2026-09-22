import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { publishedIdeas, publishedWriting } from '../lib/content';
import { parseDay } from '../lib/dates';
import { site } from '../site';

export const GET: APIRoute = async (context) => {
  const writing = await publishedWriting();
  const ideas = await publishedIdeas();
  const items = [
    ...writing.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: parseDay(entry.data.date),
      link: `/writing/${entry.id}/`,
      categories: entry.data.tags,
    })),
    ...ideas.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: parseDay(entry.data.date),
      link: `/ideas/${entry.id}/`,
      categories: ['Ideas'],
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? site.url,
    trailingSlash: true,
    customData: '<language>en-us</language>',
    items,
  });
};
