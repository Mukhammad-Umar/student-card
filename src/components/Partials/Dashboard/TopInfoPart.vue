<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import filters from '@/filters'

const props = defineProps({ info: Object })

const numbers = ref({
  value: 0,
  cycleCount: 0,
  clientCount: 0,
  divideValue: 0,
  isNeedDivide: true
})

const loading = ref(true)
const countNumber = ref(0)
const clientInterval: any = ref(false)
const dashboardStore = useDashboardStore()

watch(() => numbers.value.value, () => {
  if (numbers.value.value === countNumber.value) return

  clientInterval.value = window.setInterval(() => {
    if (countNumber.value !== numbers.value.value) {
      let change = (numbers.value.value - countNumber.value) / 10
      change = change >= 0 ? Math.ceil(change) : Math.floor(change)
      countNumber.value = countNumber.value + change
    } else clearInterval(clientInterval.value)
  }, 20)
})

async function getHeaderInfo() {
  try {
    loading.value = true
    const data = await dashboardStore.getHeaderInfo({ typeId: props.info?.id })
    numbers.value = data?.result
  } finally {
    loading.value = false
  }
}

onMounted(() => getHeaderInfo())
</script>

<template>
  <b-col lg="4" class="border-end top-infos">
    <div class="mt-3 mt-md-0 py-4 px-3 h-100 top-infos-ctn d-flex flex-column justify-content-between">
      <h5 class="text-muted text-uppercase fs-13">{{ info?.text }}</h5>

      <div class="d-flex align-items-center">
        <div class="flex-shrink-0 top-infos-icon">
          <i :class="info?.icon + ' ' + info?.color"></i>
        </div>
        <div class="flex-grow-1 ml-2 top-infos-text">
          <b-skeleton v-if="loading" type="input"></b-skeleton>

          <template v-else>
            <h2 v-if="numbers.isNeedDivide" class="mb-0">{{ filters.filterMoney(countNumber / numbers.divideValue) }}</h2>
            <h2 v-else class="mb-0">{{ filters.filterMoney(countNumber) }}</h2>
            <p v-if="info?.extra" class="mb-0 text-muted position-absolute">
              <b-badge class="bg-light text-success mb-0">{{ $t('cycle') }}: {{ numbers.cycleCount }}</b-badge>
            </p>
          </template>
        </div>
      </div>
    </div>
  </b-col>
</template>

<style lang="scss">
.top-infos {
  .top-infos-icon i {
    font-size: 32px;
  }

  .top-infos-text h2 {
    font-size: 24px !important;
  }
}

@media (max-width: 1600px) {
  .top-infos {
    .top-infos-icon i {
      font-size: 28px;
    }

    .top-infos-text h2 {
      font-size: 20px !important;
    }
  }
}

@media (max-width: 1100px) {
  .top-infos {
    h5 {
      font-size: 11px !important;
    }

    .top-infos-icon i {
      font-size: 25px;
    }

    .top-infos-text h2 {
      font-size: 17px !important;
    }
  }
}

@media (max-width: 900px) {
  .top-infos {
    .top-infos-ctn {
      padding-left: 5px !important;
      padding-right: 0 !important;
    }

    h5 {
      text-transform: capitalize !important;
    }

    .top-infos-icon i {
      font-size: 22px;
    }

    .top-infos-text h2 {
      font-size: 15px !important;
    }
  }
}

@media (max-width: 767px) {
  .top-infos {
    .top-infos-ctn {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }

    h5 {
      font-size: 13px !important;
      text-transform: uppercase !important;
    }

    .top-infos-icon i {
      font-size: 28px;
    }

    .top-infos-text h2 {
      font-size: 20px !important;
    }
  }
}
</style>
