<script setup lang="ts">
import filters from '@/filters'
import { mainStore } from '@/stores'
import { Moment } from '@/plugins/moment'
import { TranByDayChart } from '@/utils/charts'
import { useDashboardStore } from '@/stores/dashboard'
import { ref, computed, watch, onMounted } from 'vue'

import SimpleLoader from '@/components/Common/SimpleLoader.vue'
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'
import 'flatpickr/dist/plugins/monthSelect/style.css'

const store = mainStore()
const dashboardStore = useDashboardStore()

const loading = ref(true)
const showPicker = ref(true)
const transactionInfo: any = ref({})
const tranByDayChart: any = ref(TranByDayChart)
const date = ref(Moment().format('YYYY-MM-DD'))

const tranSeries: any = ref([
  { name: 'UzCard', data: [] },
  { name: 'Humo', data: [] }
])

watch(
  () => store.$state.currLocale,
  () => {
    showPicker.value = false
    setTimeout(() => (showPicker.value = true), 0)
  }
)

const configs = computed(() => {
  return {
    minDate: Moment().subtract(1, 'years').format('YYYY-MM-DD'),
    maxDate: Moment().format('YYYY-MM-DD'),
    altInput: true,
    plugins: [new (monthSelectPlugin as any)({ shorthand: false, dateFormat: 'Y-m-d', altFormat: 'M Y' })]
  }
})

watch(() => date.value, () => getTransactionInfo())

async function getTransactionInfo() {
  try {
    loading.value = true
    tranSeries.value[0].data = []
    tranSeries.value[1].data = []
    tranByDayChart.value.xaxis.categories = []

    const data = await dashboardStore.getTransactionInfoByPeriod({
      startDate: Moment(date.value).startOf('month').format('YYYY-MM-DD'),
      endDate: Moment(date.value).endOf('month').format('YYYY-MM-DD'),
    })

    transactionInfo.value = data?.result

    data?.result.uzcardDays.forEach((uzCard: any, index: any) => {
      const date = filters.filterCapitalMonthDay(uzCard.date)
      tranByDayChart.value.xaxis.categories.push(date)
      tranSeries.value[0].data.push(uzCard.transactionReverseSum / 100)
      tranSeries.value[1].data.push(data?.result.humoDays[index].transactionReverseSum / 100)
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => getTransactionInfo())
</script>

<template>
  <b-card no-body class="card-height-100 card-box-shadow">
    <b-card-header class="align-items-center d-flex">
      <b-card-title class="mb-0 flex-grow-1">
        {{ $t('dashboard.tranReverseByDayTitle') }}
      </b-card-title>
      <div v-if="showPicker">
        <flat-pickr
          v-model="date"
          :config="configs"
          class="date-picker-input text-center"
        ></flat-pickr>
      </div>
    </b-card-header>

    <SimpleLoader v-if="loading" class="my-3"/>

    <b-card-body v-else class="px-0">
      <ul class="list-inline main-chart text-center mb-0">
        <li class="list-inline-item chart-border-left me-0 border-0">
          <h4>
            {{ filters.filterMoney(transactionInfo.allUzcardTransactionReverseSum / 100) }}
            <span class="text-uzcard d-inline-block fs-13 align-middle ms-2">UzCard</span>
          </h4>
        </li>
        <li class="list-inline-item chart-border-left me-0">
          <h4>
            {{ filters.filterMoney(transactionInfo.allHumoTransactionReverseSum / 100) }}
            <span class="text-humo d-inline-block fs-13 align-middle ms-2">Humo</span>
          </h4>
        </li>
        <li class="list-inline-item chart-border-left me-0">
          <h4>
            {{ filters.filterMoney(transactionInfo.allTransactionReverseSum / 100) }}
            <span class="text-muted d-inline-block fs-13 align-middle ms-2">Общее</span>
          </h4>
        </li>
      </ul>

      <template v-if="!loading">
        <apexchart
          dir="ltr"
          width="100%"
          height="290"
          class="apex-charts"
          :options="tranByDayChart"
          :series="tranSeries"
        ></apexchart>
      </template>
    </b-card-body>
  </b-card>
</template>

<style>
.date-picker-input {
  border-top: 0;
  border-right: 0;
  border-left: 0;
}
</style>
