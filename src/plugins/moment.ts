import { createApp } from 'vue'
import Moment from 'moment'

import 'moment/dist/locale/en-gb'
import 'moment/dist/locale/ru'
import 'moment/dist/locale/uz'

// let lang = localStorage.getItem("locale") || navigator.language.substr(0, 2).toLowerCase()
const lang = localStorage.getItem('locale') || 'ru'
Moment.locale(lang)
// Moment.updateLocale(lang, lang === 'ru' ? ru : lang === 'uz' ? uz : en);

const app = createApp({})
app.config.globalProperties.$moment = Moment

export { Moment }
