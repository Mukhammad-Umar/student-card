import axios from 'axios'
import router from '@/router'
import { removeAllTokens, token } from '@/service/TokenService'
import { LANG, URL_BASE } from '../defaults'
import { useToast } from 'vue-toastification'

const toast = useToast()

const api = axios.create({
  baseURL: URL_BASE,
  headers: {
    common: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
})

api.interceptors.request.use(
  (config) => {
    config.headers['Accept-Language'] = localStorage.getItem('locale')
      ? localStorage.getItem('locale')
      : LANG

    if (token.get()) {
      config.headers.Authorization = 'Bearer ' + token.get()
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      removeAllTokens()
      router.push({ name: 'BaseLogin' }).catch(() => {})
    }

    toast.error(error.response.data.error.message)

    return Promise.reject(error)
  }
)

export { api }
