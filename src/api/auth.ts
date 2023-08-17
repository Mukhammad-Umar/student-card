import { api } from '@/plugins/axios'
import type { Login } from '@/utils/apiTypes'

const auth = 'core'

export async function login(payload: Login) {
  const { data } = await api.post(auth + '/login/', payload)
  return data
}

export async function logout(refreshToken: string) {
  const { data } = await api.put(auth + `/LogOut?refreshToken=${refreshToken}`)
  return data?.result
}
