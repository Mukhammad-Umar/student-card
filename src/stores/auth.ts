import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '@/api/auth'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { Login } from '@/utils/apiTypes'
import TokenService from '@/service/TokenService'

export const useAuthStore = defineStore('auth', () => {
  const refreshTokenIntervalId = ref(0)
  const router = useRouter()
  const userStore = useUserStore()

  async function login(payload: Login) {
    const res = await api.login(payload)
    const token = res?.token
    const orgType = res?.organizationType
    if (token) {
      await userStore.setLoginData(res)
      await refreshToken()
    }
    return { token, orgType }
  }

  async function refreshToken() {
    refreshTokenIntervalId.value = setInterval(() => {
      if (+new Date() / 1000 > TokenService.expireTime.get() - 60 && TokenService.token.get()) {
        api.refreshToken(TokenService.refreshToken.get())
      }
    }, 5000)
  }

  async function logout() {
    await api.logout(TokenService.refreshToken.get())

    await clearInterval(refreshTokenIntervalId.value)
    await userStore.removeToken()

    await router.push({ name: 'BaseAuth' })
  }

  async function errorLogout(isManual = true) {
    await userStore.removeToken()

    if (isManual) {
      window.location.href = '/'
    }
  }

  async function checkTokenValid() {
    const data = await api.checkTokenValid()
    return data
  }

  async function authClearInterval() {
    await clearInterval(refreshTokenIntervalId.value)
    await TokenService.removeAllTokens()
  }

  return {
    login,
    refreshToken,
    logout,
    errorLogout,
    checkTokenValid,
    authClearInterval
  }
})
