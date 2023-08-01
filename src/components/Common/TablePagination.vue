<script setup lang="ts">
const { pagination }: any = defineProps<{ pagination: Object }>();

const emit = defineEmits(['emit:change']);
</script>

<template>
  <div class="d-flex justify-content-between align-items-center table-pagination">
    <div v-if="pagination?.totalCount" role="status" aria-live="polite" class="gridjs-summary mt-0" title="Page 1 of 3">
      {{ $t('table.showing') }}
      <b> {{ pagination?.page !== 1 ? (pagination?.page - 1) * pagination?.rowsPerPage + 1 : pagination?.page }} </b>
      {{ $t('table.to') }}
      <b> {{ pagination?.page === pagination?.rowsNumber ? pagination?.totalCount : pagination?.page * pagination?.rowsPerPage }} </b>
      {{ $t('table.of') }} <b>{{ pagination?.totalCount }}</b> {{ $t('table.results') }}
    </div>
    <b-pagination
      v-model="pagination.page"
      class="table-pagination mb-0 ms-auto"
      :total-rows="pagination?.totalCount"
      :per-page="pagination?.rowsPerPage"
      @update:model-value="emit('emit:change')"
    ></b-pagination>
  </div>
</template>

<style lang="scss">
@media (max-width: 500px) {
  .table-pagination  {
    li {
      button, span{
        font-size: 10px;
      }
    }
  }
}

@media (max-width: 450px) {
  .table-pagination  {
    .gridjs-summary{
      display: none;
    }
  }
}
</style>
