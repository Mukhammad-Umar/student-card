<script setup lang="ts">
import Moment from 'moment'
import { reactive } from 'vue';

const filterData: any = reactive({
  userId: null,
  university: null,
  startDate: Moment(new Date()).format('YYYY-MM-DD'),
  endDate: Moment(new Date()).format('YYYY-MM-DD'),
  pagination: {
    page: 1,
    totalCount: 0,
    rowsNumber: 1,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 30
  }
})
</script>

<template>
  <RouterView :filterData="filterData" />
</template>
