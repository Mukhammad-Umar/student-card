<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useTerminalStore } from '@/stores/terminal'

import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

const props = defineProps({
  filterData: Object
})

const bankList = ref([])
const loading = ref(false)
const terminalStore = useTerminalStore()
const filterData: object = ref(props.filterData)

async function getBankList() {
  try {
    loading.value = true
    const data = await terminalStore.getBankList()
    bankList.value = data.result
  } finally {
    loading.value = false
  }
}

onMounted(() => getBankList())
</script>

<template>
  <Multiselect
    v-model="filterData.bankId"
    :options="bankList"
    label="name"
    value-prop="id"
    :loading="loading"
    :searchable="true"
    :create-option="true"
    :canClear="false"
    :canDeselect="false"
    :noOptionsText="$t('error.noData')"
    :noResultsText="$t('error.noData')"
  />
</template>
