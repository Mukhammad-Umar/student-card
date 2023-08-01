<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import filters from '@/filters'

const props = defineProps({ info: Object })

const loading = ref(true)
const dashboardStore = useDashboardStore()

const numbers = ref({
  divideValue: 100,
  isNeedDivide: false,
  value: 0
})

async function getFooterInfo() {
  try {
    loading.value = true
    const data = await dashboardStore.getFooterInfo({ typeId: props.info?.id })
    numbers.value = data?.result
  } finally {
    loading.value = false
  }
}

onMounted(() => getFooterInfo())
</script>

<template>
  <b-card no-body class="card-animate card-box-shadow">
    <b-card-body>
      <div class="d-flex justify-content-between">
        <div>
          <p class="fw-medium text-muted mb-0">{{ info?.text }}</p>
          <h2 v-if="numbers.isNeedDivide" class="mt-4 ff-secondary fw-semibold">{{ filters.filterMoney(numbers.value / numbers.divideValue) }}</h2>
          <h2 v-else class="mt-4 ff-secondary fw-semibold">{{ filters.filterMoney(numbers.value) }}</h2>
        </div>
        <div>
          <div class="avatar-sm flex-shrink-0">
            <span class="avatar-title bg-soft-info rounded-circle fs-2">
              <i class="display-7" :class="info?.icon + ' ' + info?.color"></i>
            </span>
          </div>
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<style lang="scss">
@media (max-width: 1550px) {
  .card-animate {
    h2{
      font-size: 22px;
    }
    .avatar-sm{
      width: 36px;
      height: 36px;
      i{
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 1400px) {
  .card-animate {
    h2{
      font-size: 18px;
    }
    .avatar-sm{
      width: 32px;
      height: 32px;
      i{
        font-size: 18px;
      }
    }
  }
}
</style>