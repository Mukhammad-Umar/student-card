<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TopInfoPart from '@/components/Partials/Dashboard/TopInfoPart.vue'

const { t } = useI18n()

const infos = computed(() => [
  { id: 1, color: 'text-warning', icon: 'ri-space-ship-line', text: t('infoCards.activePayments') },
  { id: 3, color: 'text-info', icon: 'ri-pulse-line', text: t('infoCards.todayProcessed'), extra: true },
  { id: 6, color: 'text-info', icon: 'mdi mdi-credit-card', text: t('infoCards.todayTransaction') },
  { id: 4, color: 'text-warning', icon: 'ri-trophy-line', text: t('infoCards.todayPayment') },
  { id: 2, color: 'text-success', icon: 'ri-exchange-dollar-line', text: t('infoCards.todayAvarage') },
  { id: 5, color: 'text-danger', icon: 'ri-refund-2-line', text: t('infoCards.todayCanceledPayment') }
])
</script>

<template>
  <b-row>
    <b-col xl="12">
      <b-card no-body class="crm-widget card-box-shadow">
        <b-card-body class="p-0">
          <b-row class="row-cols-md-3 row-cols-1">
            <template v-for="info in infos" :key="info.id">
              <TopInfoPart :info="info" />
            </template>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>
