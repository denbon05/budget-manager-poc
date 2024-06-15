import type { CapacitorConfig } from '@capacitor/cli';
// https://capgo.app/blog/building-a-native-mobile-app-with-nuxt-3-and-capacitor/#using-capacitor-plugins

const config: CapacitorConfig = {
  appId: 'budget.manager',
  appName: 'budget-manager',
  webDir: 'dist',
  server: {
    url: 'http://0.0.0.0:3000',
    cleartext: true,
  },
};

export default config;
