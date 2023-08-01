<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrgUserStore } from '@/stores/orgUsers'
import FormComponent from '../components/FormComponent.vue'

const form: any = ref({})
const loading = ref(true)
const route: any = useRoute()
const orgUserStore = useOrgUserStore()

async function getById() {
  try {
    const data = await orgUserStore.getOne(route.params.id)
    form.value = data.result

    form.value.phone = form.value?.phone?.slice(3)
  } finally {
    loading.value = false
  }
}

onMounted(() => getById())
</script>

<template>
  <FormComponent v-if="!loading" :form="form" />
</template>
