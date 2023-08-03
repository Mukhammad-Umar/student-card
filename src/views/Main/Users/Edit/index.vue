<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {useAdminStore} from "@/stores/admin";
import FormComponent from '../components/FormComponent.vue'

const form: any = ref({})
const gotData = ref(true)
const route: any = useRoute()
const adminStore = useAdminStore();

async function getById() {
  try {
    const data = await adminStore.getAdminById(route.params.id)
    form.value = data.result

    form.value.phone = form.value?.phone?.slice(3)
  } finally {
    gotData.value = false
  }
}

onMounted(() => getById())
</script>

<template>
  <FormComponent v-if="!gotData" :form="form" />
</template>
