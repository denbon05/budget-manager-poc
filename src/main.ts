// import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import { i18n, vuetify } from './plugins/';
import router from './router';

if ('serviceWorker' in navigator) {
  console.log('SERVICE WORKER IN THE NAVIGATOR');
  // register Service Worker
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log(
          'Service Worker registered with scope:',
          registration.scope,
        );
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

const app = createApp(App).use(router).use(i18n).use(vuetify);

app.mount('#app');
