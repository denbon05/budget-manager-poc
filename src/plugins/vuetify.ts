import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import { createVuetify, type ThemeDefinition } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFF',
    primary: '#00AE31', // green
    'primary-darken-1': '#096200',
    secondary: '#7204E0', // purple
    'secondary-darken-1': '#4a078c',
    'app-yellow': '#FFDD55',
    surface: '#FFFFFF',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    disabled: '#87828C', // grey-brown
  },
};

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#FFF',
    primary: '#00AE31', // green
    'primary-darken-1': '#096200',
    secondary: '#7204E0',
    'secondary-darken-1': '#4a078c',
    'app-yellow': '#FFE785',
    surface: '#FFFFFF',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    disabled: '#56515c', // grey-dark-brown-purple
  },
};

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light,
      dark,
    },
  },
});

export default vuetify;
