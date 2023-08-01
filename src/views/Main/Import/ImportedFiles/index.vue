<script setup lang="ts">
import Moment from 'moment'
import { reactive } from 'vue';

const filterData = reactive({
  startDate: Moment(new Date()).format('YYYY-MM-DD'),
  endDate: Moment(new Date()).format('YYYY-MM-DD'),
  pagination: {
    page: 1,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 10,
    rowsNumber: 1,
    totalCount: 1,
  },
})
</script>

<template>
  <router-view :filterData="filterData"/>
</template>
