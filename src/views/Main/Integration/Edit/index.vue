<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useIntegrationSystemStore } from '@/stores/integrationSystem'
import FormComponent from '../Components/FormComponent.vue'

const form = ref()
const route: any = useRoute()
const integrationSystemStore = useIntegrationSystemStore()

async function getIntegrationSystemsById() {
  const data = await integrationSystemStore.getIntegrationSystemsById(route.params.id)
  form.value = data?.result
}

onMounted(() => getIntegrationSystemsById())
</script>

<template>
  <FormComponent v-if="form" :form="form" />
</template>

<style></style>
