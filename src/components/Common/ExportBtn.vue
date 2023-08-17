<script setup lang="ts">
const props = defineProps({
  rows: Array,
  text: String,
  date: String,
  loadBtn: Boolean
})

const download = (data: any) => {
  const downloadUrl = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = downloadUrl
  link.setAttribute('download', props.text + `${props.date || ''}.xlsx`) //any other extension
  document.body.appendChild(link)
  link.click()
  link.remove()
}

defineExpose({
  download
})
</script>

<template>
  <b-button
    class="excel-import"
    :loadingMode="'fill'"
    :loading="loadBtn"
    @click="$emit('emit:import')"
    :disable="!rows?.length"
  >
    <i class="mdi mdi-file-excel-outline"></i> {{ $t('export') }}
  </b-button>
</template>

<style lang="scss">
@media (max-width: 500px) {
  .excel-import {
    div {
      font-size: 12px;
    }
  }
}
</style>
