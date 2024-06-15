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
        workbox: {
          cleanupOutdatedCaches: true,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
        },
        devOptions: {
          enabled: !isProduction,
          /* when using generateSW the PWA plugin will switch to classic */
          type: 'module',
          // navigateFallback: 'index.html',
          suppressWarnings: false,
        },
        includeAssets: ['favicon.png'],
        useCredentials: true,
        manifest: {
          name: 'Budget planner',
          short_name: 'Budget',
          display: 'standalone',
          theme_color: '#ffffff',
          description: 'Budget manager app',
          icons: [
            {
              src: 'icons/gold-coin-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'icons/gold-coin-256x256.png',
              sizes: '256x256',
              type: 'image/png',
            },
            {
              src: 'icons/gold-coin-384x384.png',
              sizes: '384x384',
              type: 'image/png',
            },
            {
              src: 'icons/gold-coin-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
      removeConsole(),
      // mkcert(),
    ],
    build: {
      manifest: true, // TODO check -> remove if unnecessary
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
