/**
 * Public origin for this site.
 * Custom domain served by GitHub Pages (public/CNAME). The dast1.github.io
 * address redirects here once the domain is set in the Pages settings.
 */
export const siteUrl = 'https://dastan.aitzhanov.com';

export const site = {
  name: 'Dastan Aitzhanov',
  title: 'Dastan Aitzhanov | AI Systems, Authority, and Ownership',
  description:
    'Dastan Aitzhanov builds AI systems and writes about delegated authority: who grants it, where it ends, and who answers for the result, seen as an owner as well as an engineer.',
  url: siteUrl,
  email: 'dastan.aitzhanov@gmail.com',
  github: 'https://github.com/dast1',
  linkedin: 'https://www.linkedin.com/in/dastan1',
  awsAuthor: 'https://aws.amazon.com/blogs/machine-learning/author/dastana/',
  location: 'Texas',
  locale: 'en_US',
} as const;
