<script setup lang="ts">
import { ref } from 'vue'
import FormComponent from '../components/FormComponent.vue'

const form = ref({
  phone: '',
  roleId: 0,
  photo: '',
  userName: '',
  password: '',
  lastName: '',
  firstName: '',
  isBlocked: false,
  isActivate: true,
  organizationBranchId: null,
  organizationId: Number(localStorage.getItem('orgId')) || null,
})
</script>

<template>
  <FormComponent :form="form" />
</template>
