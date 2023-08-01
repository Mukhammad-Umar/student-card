<script setup lang="ts">
import { reactive } from 'vue'
import { mainStore } from '@/stores'

const store = mainStore()

store.filterData = reactive({
  countInfo: null,
  contractLoanId: null,
  autoPaymentDate: null,
  organizationBranchId: 0,
  isFinishedAutoPayments: false,
  pagination: {
    page: 1,
    rowsNumber: 1,
    totalCount: 1,
    descending: true,
    sortBy: 'payedAmount',
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 10
  }
})
</script>

<template>
  <router-view :filterData="store.filterData" />
</template>

<style></style>
