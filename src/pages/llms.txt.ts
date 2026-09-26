import type { APIRoute } from 'astro';
import { publishedIdeas, publishedProjects, publishedWriting } from '../lib/content';
import { site } from '../site';

// A plain-text map of the site for language-model readers (llmstxt.org).
export const GET: APIRoute = async () => {
  const url = (path: string) => new URL(path, site.url).href;
  const line = (title: string, path: string, description: string) =>
    `- [${title}](${url(path)}): ${description}`;
  const byDate = <T extends { data: { date: string } }>(a: T, b: T) =>
    b.data.date.localeCompare(a.data.date);

  const writing = (await publishedWriting()).sort(byDate);
  const ideas = (await publishedIdeas()).sort(byDate);
  const work = (await publishedProjects()).sort(byDate);

  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} is an AI systems builder and writer based in ${site.location}. Experience: Solutions Architect at Databricks until August 2026; AI/ML Specialist Solutions Architect at AWS before that; earlier, managing director of an operating business and founder of a quantitative investment firm. Current work: AI systems that act on behalf of people and organizations, and writing about how that authority is granted, limited, and answered for.`,
    '',
    `- [About](${url('/about/')})`,
    `- [LinkedIn](${site.linkedin})`,
    `- [GitHub](${site.github})`,
    '',
    '## Essays',
    '',
    ...writing.map((e) => line(e.data.title, `/writing/${e.id}/`, e.data.description)),
    '',
    '## Ideas',
    '',
    ...ideas.map((e) => line(e.data.title, `/ideas/${e.id}/`, e.data.description)),
    '',
    '## Work',
    '',
    ...work.map((e) => line(e.data.title, `/work/${e.id}/`, e.data.description)),
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
