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
const chartMode = ref(true)
const showPicker = ref(true)
const transactionInfo: any = ref({})
const date = ref(Moment().format('YYYY-MM-DD'))
const startDate = ref(Moment().format('YYYY-MM-DD'))
const endDate = ref(Moment().format('YYYY-MM-DD'))
const tranByDayChart: any = ref(JSON.parse(JSON.stringify(TranByDayChart)))

const tranSeries: any = ref([
  { name: 'UzCard', data: [] },
  { name: 'Humo', data: [] }
])

watch(() => store.$state.currLocale, () => {
  showPicker.value = false
  setTimeout(() => (showPicker.value = true), 0)
})

watch(() => chartMode.value, val => {
  if(val) tranByDayChart.value.chart.type = 'area'
  else tranByDayChart.value.chart.type = 'bar'
  getTransactionInfo()
})

const configs = computed(() => {
  return {
    minDate: Moment().subtract(1, 'years').format('YYYY-MM-DD'),
    maxDate: Moment().format('YYYY-MM-DD'),
    altInput: true,
    plugins: [new (monthSelectPlugin as any)({ shorthand: false, dateFormat: 'Y-m-d', altFormat: 'M Y' })]
  }
})

const startDateConfigs = computed(() => {
  return {
    minDate: Moment().subtract(1, 'years').format('YYYY-MM-DD'),
    maxDate: endDate.value || Moment().format('YYYY-MM-DD'),
    altInput: true,
    altFormat: 'd.m.Y'
  }
})

const endDateConfigs = computed(() => {
  return {
    minDate: startDate.value || Moment().subtract(1, 'years').format('YYYY-MM-DD'),
    maxDate: Moment().format('YYYY-MM-DD'),
    altInput: true,
    altFormat: 'd.m.Y'
  }
})

watch(() => date.value, () => getTransactionInfo())
watch(() => startDate.value, () => getTransactionInfo())
watch(() => endDate.value, () => getTransactionInfo())

async function getTransactionInfo() {
  try {
    loading.value = true
    tranSeries.value[0].data = []
    tranSeries.value[1].data = []
    tranByDayChart.value.xaxis.categories = []

    const data = chartMode.value 
      ? await dashboardStore.getTransactionInfoByPeriod({
        startDate: Moment(date.value).startOf('month').format('YYYY-MM-DD'),
        endDate: Moment(date.value).endOf('month').format('YYYY-MM-DD')
      })
      : await dashboardStore.getTransactionInfoByPeriod({
        startDate: Moment(startDate.value).format('YYYY-MM-DD'),
        endDate: Moment(endDate.value).format('YYYY-MM-DD')
      })

    transactionInfo.value = data?.result

    data?.result.uzcardDays.forEach((uzCard: any, index: any) => {
      const date = filters.filterCapitalMonthDay(uzCard.date)
      tranByDayChart.value.xaxis.categories.push(date)
      tranSeries.value[0].data.push(uzCard.transactionSum / 100)
      tranSeries.value[1].data.push(data?.result.humoDays[index].transactionSum / 100)
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getTransactionInfo()

  tranByDayChart.value.yaxis = {
    labels: {
      formatter: function (value: string) {
        return Number(value).toLocaleString('ru-RU')
      }
    },
    tickAmount: 5
  }

  tranByDayChart.value.tooltip = {
    y: {
      formatter: function (val: string) {
        return Number(val).toLocaleString('ru-RU')
      },
      title: {
        formatter: (seriesName: string) => seriesName
      }
    }
  }
})
</script>

<template>
  <b-card no-body class="card-height-100 card-box-shadow">
    <b-card-header class="dash-tran-header d-flex justify-content-between align-items-center">
      <b-card-title class="mb-1">{{ $t('dashboard.tranByDayTitle') }}</b-card-title>

      <div class="chart-mode">
        <input v-model="chartMode" class="check" type="checkbox" id="checkbox_toggle">
        <div class="checkbox">
          <label for="checkbox_toggle" class="slide mb-0">
            <label for="checkbox_toggle" class="active_toggle mb-0"></label>
            <label for="checkbox_toggle" class="text mb-0">По дням</label>
            <label for="checkbox_toggle" class="text mb-0">По месяцу</label>
          </label>
        </div>
      </div>

      <div v-if="showPicker" class="mb-1" :class="{'d-none': chartMode === false}">
        <flat-pickr
          v-model="date"
          :config="configs"
          class="date-picker-input text-center"
        ></flat-pickr>
      </div>

      <div class="d-flex mb-1" :class="{'d-none': chartMode}">
        <flat-pickr
          v-model="startDate"
          :config="startDateConfigs" id="filter-startDate"
          :placeholder="$t('selectDate')" class="date-picker-input text-center"
        ></flat-pickr>

        <i class="mdi mdi-minus h3 pt-1 mb-0"></i>

        <flat-pickr
          v-model="endDate"
          :config="endDateConfigs" id="filter-endDate"
          :placeholder="$t('selectDate')" class="date-picker-input text-center"
        ></flat-pickr>
      </div>
    </b-card-header>

    <SimpleLoader v-if="loading" class="my-3"/>

    <b-card-body v-else class="px-0">
      <ul class="list-inline main-chart text-center mb-0">
        <li class="list-inline-item chart-border-left me-0 border-0">
          <h4>
            {{ filters.filterMoney(transactionInfo.allUzcardTransactionSum / 100) }}
            <span class="text-uzcard d-inline-block fs-13 align-middle ms-2">UzCard</span>
          </h4>
        </li>
        <li class="list-inline-item chart-border-left me-0">
          <h4>
            {{ filters.filterMoney(transactionInfo.allHumoTransactionSum / 100) }}
            <span class="text-humo d-inline-block fs-13 align-middle ms-2">Humo</span>
          </h4>
        </li>
        <li class="list-inline-item chart-border-left me-0">
          <h4>
            {{ filters.filterMoney(transactionInfo.allTransactionSum / 100) }}
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

<style lang="scss">
.date-picker-input {
  width: 140px;
  border-top: 0;
  border-right: 0;
  border-left: 0;
}
</style>
