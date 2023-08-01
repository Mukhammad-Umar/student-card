<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRoleStore } from '@/stores/role'
import FormComponent from '../components/FormComponent.vue'

const form = ref({})
const loading = ref(true)
const route: any = useRoute()
const roleStore = useRoleStore()

async function getById() {
  try {
    const data = await roleStore.getById(route.params.id)
    form.value = data.result
  } finally {
    loading.value = false
  }
}

onMounted(() => getById())
</script>

<template>
  <FormComponent v-if="!loading" :form="form" />
</template>
