// import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import { i18n, vuetify } from './plugins/';
import router from './router';

const app = createApp(App).use(router).use(i18n).use(vuetify);

app.mount('#app');
