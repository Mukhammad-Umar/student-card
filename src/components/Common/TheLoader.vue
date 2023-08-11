<script setup lang="ts">
import { ref, computed } from 'vue'

import logoDark from '@/assets/logo-dark.svg'
import logoLight from '@/assets/logo-light.svg'

const props = defineProps({
  loading: Boolean
})

const dialog = ref(props.loading)

const computedLogo = computed(() => {
  const mode = localStorage.getItem('isDark') === 'true'
  return mode ? logoLight : logoDark
})
</script>

<template>
  <b-modal
    v-model="dialog"
    centered
    :no-close-on-backdrop="true"
    :hide-header="true"
    :hide-footer="true"
    style="opacity: 1"
  >
    <b-container
      fluid
      class="d-flex justify-content-center align-items-center flex-column q-pa-lg loader-dialog"
    >
      <div class="flex q-mb-md">
        <img width="215" class="q-mr-sm" :src="computedLogo" />
      </div>
      <div class="loader-linear">
        <b-progress
          :value="100"
          variant="primary"
          :animated="true"
          class="mt-3"
          height="8px"
        ></b-progress>
      </div>
    </b-container>
  </b-modal>
</template>

<style>
.loader-brand {
  font-family: InterMedium, sans-serif !important;
  font-size: 25px;
  letter-spacing: 2px;
}
.loader-linear {
  width: 100%;
}
</style>
