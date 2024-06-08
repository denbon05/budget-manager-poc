import en from '@/locales/en.json';
import type { AppLocale, MsgSchema } from '@/types/locales';
import { createI18n } from 'vue-i18n';

const i18n = createI18n<[MsgSchema], AppLocale>({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
  },
});

export default i18n;
