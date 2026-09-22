import { site } from '../site';

export function siteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        name: site.name,
        url: site.url,
        description: site.description,
        inLanguage: 'en-US',
        author: { '@id': `${site.url}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${site.url}/#person`,
        name: site.name,
        url: site.url,
        email: `mailto:${site.email}`,
        description: site.description,
        address: {
          '@type': 'PostalAddress',
          addressRegion: site.location,
          addressCountry: 'US',
        },
        sameAs: [site.github],
        knowsAbout: [
          'Artificial intelligence',
          'Machine learning',
          'Cloud computing',
          'Data platforms',
          'Investing',
        ],
      },
    ],
  };
}

export function articleJsonLd(args: {
  title: string;
  description: string;
  date: string;
  url: string;
  tags?: string[];
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: args.title,
    description: args.description,
    datePublished: `${args.date}T12:00:00.000Z`,
    author: {
      '@type': 'Person',
      name: site.name,
      url: site.url,
    },
    mainEntityOfPage: args.url,
    keywords: args.tags?.join(', '),
    inLanguage: 'en-US',
  };
}
