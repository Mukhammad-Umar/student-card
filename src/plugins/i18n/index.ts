import { createI18n } from 'vue-i18n'

import ru from './messages/ru'
import en from './messages/en'
import uz from './messages/uz'

const setDateTimeFormats = {
  short: {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  long: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric'
  }
}

const dateTimeFormats = {
  en: setDateTimeFormats,
  es: setDateTimeFormats,
  de: setDateTimeFormats,
  'en-GB': setDateTimeFormats
}

const i18n = createI18n({
  // locale: localStorage.getItem("locale") || navigator.language.substr(0, 2).toLowerCase(),
  locale: localStorage.getItem('locale') || 'ru',
  fallbackLocale: localStorage.getItem('locale') || 'ru',
  legacy: false,
  globalInjection: true,
  allowComposition: true, // you need to specify that!
  dateTimeFormats,
  messages: {
    ru,
    en,
    uz
  }
})

export default i18n
