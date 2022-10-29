import { resolveNocobasePackagesAlias } from '@nocobase/devtools/umiConfig';
import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'NocoBase',
  // outputPath: `./docs/dist/${lang}`,
  mode: 'site',
  resolve: {
    includes: ['./'],
  },
  // locales: [[lang, lang]],
  hash: true,
  logo: 'https://pica.zhimg.com/80/v2-009075edea0cff50f53ce64a51028518_1440w.png?source=d16d100b',
  navs: [
    null,
    {
      title: 'GitHub',
      path: 'https://github.com/nocobase/nocobase',
    },
  ],
  chainWebpack(config) {
    resolveNocobasePackagesAlias(config);
  },
});
