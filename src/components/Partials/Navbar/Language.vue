<script setup lang="ts">
import Moment from 'moment'
import { useI18n } from 'vue-i18n'
import { mainStore } from '@/stores'
import { ref, computed, onMounted } from 'vue'

import flatpickr from 'flatpickr'
import { default as English } from 'flatpickr/dist/l10n/default.js'
import { Russian } from 'flatpickr/dist/l10n/ru.js'
import { Uzbek } from 'flatpickr/dist/l10n/uz.js'

const store = mainStore()
const { locale } = useI18n()

const languages = ref([
  { flag: '/images/flags/us.svg', language: 'en', title: 'English' },
  { flag: '/images/flags/ru.svg', language: 'ru', title: 'Русский' },
  { flag: '/images/flags/uz.svg', language: 'uz', title: 'O`zbekcha' }
])

const langsFilter = computed(() => {
  return languages.value.filter((lang) => lang.language !== locale.value)
})

const setLanguage = (lang: string) => {
  Moment.locale(lang)
  locale.value = lang
  store.$state.currLocale = lang
  localStorage.setItem('locale', lang)
  flatpickr.localize(lang === 'ru' ? Russian : lang === 'uz' ? Uzbek : English)
}

onMounted(() => {
  const lang = store.$state.currLocale
  flatpickr.localize(lang === 'ru' ? Russian : lang === 'uz' ? Uzbek : English)
})
</script>

<template>
  <div class="dropdown ms-1 topbar-head-dropdown header-item">
    <button
      type="button"
      class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
      data-bs-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <template v-for="(lang, index) in languages">
        <img
          v-if="lang.language === locale" :key="index"
          id="header-lang-img" height="20"
          :src="lang.flag" :alt="lang.title" class="rounded"
        />
      </template>
    </button>
    <div class="dropdown-menu dropdown-menu-end">
      <b-link
        v-for="(lang, i) in langsFilter"
        :key="`Lang${i}`" :value="lang"
        @click="setLanguage(lang.language)"
        :class="{ active: locale === lang.language }"
        class="dropdown-item notify-item language py-2"
        :data-lang="lang.language" :title="lang.title"
      >
        <img :src="lang.flag" alt="user-image" class="me-2 rounded" height="18" />
        <span class="align-middle">{{ lang.title }}</span>
      </b-link>
    </div>
  </div>
</template>
