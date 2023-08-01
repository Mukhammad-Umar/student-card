<script setup lang="ts">
import { reactive } from 'vue'
import { mainStore } from '@/stores'

const store = mainStore()

store.filterData = reactive({
  fio: null,
  pinfl: null,
  // phoneNumber: null,
  passportInfo: null,
  contractLoanId: null,
  pagination: {
    page: 1,
    rowsNumber: 1,
    totalCount: 1,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 10
  }
})
</script>

<template>
  <RouterView :key="$route.fullPath" :filterData="store.filterData"/>
</template>
