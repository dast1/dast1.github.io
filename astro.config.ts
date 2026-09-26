import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { siteUrl } from './src/site';

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/projects/'),
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
      defaultColor: false,
      wrap: true,
      transformers: [
        {
          name: 'pre-tabindex',
          pre(node) {
            node.properties.tabindex = 0;
          },
        },
      ],
    },
  },
});
