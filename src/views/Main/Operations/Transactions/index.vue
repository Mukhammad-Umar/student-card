<script setup lang="ts">
import { reactive } from 'vue'
import { mainStore } from '@/stores'
import Moment from "moment";

const store = mainStore()

store.filterData = reactive({
  pan: null,
  ext: null,
  fio: null,
  pinfl: null,
  refNum: null,
  infoState: 0,
  countInfo: null,
  wclientType: null,
  cardGateType: null,
  transactionState: 0,
  contractLoanId: null,
  integrationSystemId: 0,
  organizationBranchId: 0,
  startDate: Moment(new Date()).format("YYYY-MM-DD"),
  endDate: Moment(new Date()).format("YYYY-MM-DD"),
  pagination: {
    page: 1,
    rowsNumber: 1,
    totalCount: 1,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 10,
  },
})
</script>

<template>
  <router-view :filterData="store.filterData" />
</template>

<style></style>
