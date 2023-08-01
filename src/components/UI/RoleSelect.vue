<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useOrgUserStore } from '@/stores/orgUsers'

const { params }: any = defineProps<{ params: Object }>()

const roles = ref([])
const orgUserStore = useOrgUserStore()

watch(() => params?.organizationBranchId, val => getRoles(val))

async function getRoles(organizationBranchId = null) {
  const data = await orgUserStore.getRoles({ organizationBranchId })

  roles.value = data.result

  if (params?.roleId) {
    params.roleId = data.result.filter((role: any) => role.id === params?.roleId)[0].id
  }
}

// onMounted(() => getRoles())
</script>

<template>
  <b-form-select
    v-model="params.roleId"
    :options="roles"
    value-field="id"
    text-field="name"
  ></b-form-select>
</template>
