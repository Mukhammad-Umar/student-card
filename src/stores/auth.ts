import { defineStore } from 'pinia'
import * as api from '@/api/auth'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import TokenService from '@/service/TokenService'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const userStore = useUserStore()

  async function login(payload: any) {
    const res = await api.login(payload)
    const token = res?.token
    if (res?.token) await userStore.setLoginData(res)
    return { token }
  }

  async function logout() {
    await userStore.removeToken()
    await router.push({ name: 'BaseAuth' })
  }

  async function errorLogout(isManual = true) {
    await userStore.removeToken()

    if (isManual) {
      window.location.href = '/'
    }
  }

  async function authClearInterval() {
    await TokenService.removeAllTokens()
  }

  return {
    login,
    logout,
    errorLogout,
    authClearInterval
  }
})
