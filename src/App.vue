<script setup lang="ts">
import { onMounted } from 'vue'

const mode = localStorage.getItem('isDark') === 'true' ? 'dark' : 'light'

onMounted(() => {
  document.documentElement.setAttribute('data-sidebar', mode)
  document.documentElement.setAttribute('data-layout-mode', mode)
})
</script>

<template>
  <RouterView />
</template>
