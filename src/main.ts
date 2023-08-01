import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vMaska } from 'maska'
import { tooltip } from './directives/tooltip'

import AOS from 'aos'
import App from '@/App.vue'
import i18n from '@/plugins/i18n'
import router from '@/router'
import filters from '@/filters'
import can from './directives/can'
import VueFeather from 'vue-feather'
import VueApexCharts from 'vue3-apexcharts'
import BootstrapVue3 from 'bootstrap-vue-next'

import VueflatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

import '@/plugins/index'
import 'aos/dist/aos.css'
import '@/assets/main.scss'

import '@/assets/scss/mermaid.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import '@vueform/slider/themes/default.css'
import '@/assets/scss/config/default/app.scss'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)

AOS.init({
  easing: 'ease-out-back',
  duration: 1000
})

app.config.globalProperties.$filters = filters

app
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(VueApexCharts)
  .use(BootstrapVue3)
  .directive('maska', vMaska)
  .directive('can', can)
  .directive('tooltip', tooltip)
  .component(VueFeather.type, VueFeather)
  .component('flatPickr', VueflatPickr)
  .mount('#app')
