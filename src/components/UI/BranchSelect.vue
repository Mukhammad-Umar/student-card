<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBranchStore } from '@/stores/branch'

const props = defineProps({
  params: Object,
  branches: Array,
  isLabel: Boolean,
  notClear: Boolean
})

const route: any = useRoute()
const branches: any = ref([])
const params: any = ref(props.params)
const branchStore = useBranchStore()

watch(() => props.branches,(val) => {
  branches.value = val
})

async function getBranches() {
  const data = await branchStore.getBranches()

  if (route.name?.includes('List')) {
    branches.value = data
  } else {
    branches.value = data.filter((branch: any) => branch.id !== 0)
  }

  if (props.params?.organizationBranchId) {
    props.params.organizationBranchId = data.filter((branch: any) => branch.id === props.params?.organizationBranchId)[0].id
  }
}

onMounted(() => {
  if (!props.branches) getBranches()
})
</script>

<template>
  <b-form-select
    v-model="params.organizationBranchId"
    :options="branches"
    value-field="id"
    text-field="name"
  ></b-form-select>
</template>
