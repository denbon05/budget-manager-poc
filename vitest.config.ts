import { fileURLToPath } from 'node:url';
import type { UserConfig } from 'vitest/config';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig((configEnv) =>
  mergeConfig(viteConfig(configEnv), {
    test: {
      environment: 'jsdom',
      include: ['__tests__/components/*.[jt]s'],
      exclude: [...configDefaults.exclude, '__tests__/e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      server: {
        deps: {
          inline: ['vuetify'],
        },
      },
    },
  } as UserConfig),
);
