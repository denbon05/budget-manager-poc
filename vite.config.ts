import { fileURLToPath, URL } from 'node:url';
import { VitePWA } from 'vite-plugin-pwa';
import removeConsole from 'vite-plugin-remove-console';
// import mkcert from 'vite-plugin-mkcert'; // TODO remove?

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        injectManifest: {
          swSrc: 'src/sw.ts',
          swDest: 'dist/sw.js',
        },
        devOptions: {
          enabled: !isProduction,
          /* when using generateSW the PWA plugin will switch to classic */
          type: 'module',
          navigateFallback: 'index.html',
          suppressWarnings: false,
        },
        includeAssets: ['favicon.ico'],
        manifest: {
          name: 'Budget planner',
          theme_color: '#ffffff',
          // TODO devices icons
        },
      }),
      removeConsole(),
      // mkcert(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('vuetify')) {
              // separate vuetify as a separated chunk due to its large size
              return 'vuetify';
            }

            if (id.includes('node_modules')) {
              // the rest vendor deps
              return 'vendor';
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: true,
      port: 3000,
    },
  };
});
