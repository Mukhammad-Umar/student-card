<script setup lang="ts">
import { ref } from 'vue'
import FormComponent from '../components/FormComponent.vue'

const form = ref({
  userName: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  isBlocked: false,
  isActivate: true
})
</script>

<template>
  <FormComponent :form="form" />
</template>
