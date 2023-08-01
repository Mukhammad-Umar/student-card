<script setup lang="ts">
import { ref, watch } from 'vue'

const { pagination }: any = defineProps<{ pagination: Object }>()

const options = ref([10, 30, 50])

watch(() => pagination?.rowsPerPage, val => {
  pagination.page = 1
  localStorage.setItem('pageSize', val)
  emit('emit:update')
})

const emit = defineEmits(['emit:update'])
</script>

<template>
  <b-card-title class="table-per-page mb-0 d-flex align-items-center flex-wrap">{{ $t('table.show') }}
    <b-form-select
      v-model="pagination.rowsPerPage"
      class="mx-2"
      :options="options"
    ></b-form-select>
    {{ $t('table.records') }}
  </b-card-title>
</template>

<style lang="scss">
.table-per-page {
  font-size: 15px;
  min-width: 200px;

  .form-select{
    width: 80px;
  }
}

@media (max-width: 1350px) {
  .table-per-page {
    font-size: 12px !important;

    .form-select{
      padding: 5px;
      width: 65px;
    }
  }
}
</style>
