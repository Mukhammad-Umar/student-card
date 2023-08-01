<script setup lang="ts">
const props = defineProps({
  epos: Array,
  params: Object
})
</script>

<template>
  <select class="form-select" data-choices :value="params?.eposId">
    <option v-for="single in (epos as any)" :key="single.id" :value="single.id">
      {{ single.name }}
    </option>
  </select>
</template>
