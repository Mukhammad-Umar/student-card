<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BottomInfoPart from '@/components/Partials/Dashboard/BottomInfoPart.vue'

const { t } = useI18n()

const infos = computed(() => [
  { id: 1, color: 'text-info', icon: 'ri-team-line', text: t('infoCards.clientCount') },
  { id: 2, color: 'text-info', icon: 'ri-exchange-dollar-line', text: t('infoCards.totalWriteOff') },
  { id: 3, color: 'text-info', icon: 'ri-pulse-line', text: t('infoCards.canceledCount'), extra: 'Цикл: 7' },
  { id: 4, color: 'text-info', icon: 'ri-arrow-right-up-line', text: t('infoCards.predictCount') },
])
</script>

<template>
  <b-row>
    <b-col xl="3" md="6" v-for="info in infos" :key="info.id">
      <BottomInfoPart :info="info" />
    </b-col>
  </b-row>
</template>
