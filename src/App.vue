<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { v4 as generateUniqueId } from 'uuid'
import TokenService from '@/service/TokenService'

const authStore = useAuthStore()

const mode = localStorage.getItem('isDark') === 'true' ? 'dark' : 'light'

if (!TokenService.deviceId.get()) TokenService.deviceId.save(generateUniqueId())

onMounted(() => {
  if (TokenService.token.get()) authStore.refreshToken()

  document.documentElement.setAttribute('data-sidebar', mode)
  document.documentElement.setAttribute('data-layout-mode', mode)
})
</script>

<template>
  <RouterView />
</template>

<style></style>
