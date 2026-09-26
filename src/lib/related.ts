import { publishedIdeas, publishedProjects, publishedWriting } from './content';

export interface RelatedLink {
  href: string;
  title: string;
  kind: 'Essay' | 'Work' | 'Idea';
}

/** Resolve site paths from an idea's `related` list to titles. Unknown paths are dropped. */
export async function resolveRelated(paths: string[]): Promise<RelatedLink[]> {
  const [writing, work, ideas] = await Promise.all([publishedWriting(), publishedProjects(), publishedIdeas()]);
  const out: RelatedLink[] = [];
  for (const href of paths) {
    const match = /^\/(writing|work|ideas)\/([a-z0-9-]+)\/$/.exec(href);
    if (!match) continue;
    const [, section, id] = match;
    if (section === 'writing') {
      const entry = writing.find((e) => e.id === id);
      if (entry) out.push({ href, title: entry.data.title, kind: 'Essay' });
    } else if (section === 'work') {
      const entry = work.find((e) => e.id === id);
      if (entry) out.push({ href, title: entry.data.title, kind: 'Work' });
    } else {
      const entry = ideas.find((e) => e.id === id);
      if (entry) out.push({ href, title: entry.data.title, kind: 'Idea' });
    }
  }
  return out;
}

/** Ideas that list the given page among their related paths, newest first. */
export async function ideasRelatedTo(path: string): Promise<RelatedLink[]> {
  const ideas = await publishedIdeas();
  return ideas
    .filter((entry) => entry.data.related.includes(path))
    .map((entry) => ({ href: `/ideas/${entry.id}/`, title: entry.data.title, kind: 'Idea' as const }));
}
