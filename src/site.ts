/**
 * Public origin for this site.
 * GitHub Pages user site: https://dast1.github.io
 * Custom domain later: change this URL, add public/CNAME with the hostname,
 * and set the domain in the repository Pages settings.
 */
export const siteUrl = 'https://dast1.github.io';

export const site = {
  name: 'Dastan Aitzhanov',
  title: 'Dastan Aitzhanov | AI Systems, Governance, and Ownership',
  description:
    'Dastan Aitzhanov writes about AI systems, delegated authority, personal computing, distributed infrastructure, and the incentives around them.',
  url: siteUrl,
  email: 'dastan.aitzhanov@gmail.com',
  github: 'https://github.com/dast1',
  linkedin: 'https://www.linkedin.com/in/dastan1',
  awsAuthor: 'https://aws.amazon.com/blogs/machine-learning/author/dastana/',
  location: 'Texas',
  locale: 'en_US',
} as const;
