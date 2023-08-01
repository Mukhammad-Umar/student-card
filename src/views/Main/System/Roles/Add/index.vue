<script setup lang="ts">
import { ref } from 'vue'
import FormComponent from '../components/FormComponent.vue'

const form = ref({ roleName: '', organizationBranchId: null })
</script>

<template>
  <FormComponent :form="form" />
</template>
