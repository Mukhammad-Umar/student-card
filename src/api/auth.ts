import { api } from '@/plugins/axios'
import type { Login } from '@/utils/apiTypes'
import TokenService from '@/service/TokenService'

const auth = 'api-core/Authentification'

export async function login(payload: Login) {
  const { data } = await api.post(auth + '/SignIn', payload)
  return data?.result
}

export async function refreshToken(refreshToken: string) {
  const { data } = await api.get(auth + `/GetToken?refreshtoken=${refreshToken}`)

  if (data.result.organizationType === 0) data.result.permissions.push('admin')

  TokenService.token.save(data.result.token)
  TokenService.refreshToken.save(data.result.refreshToken)
  TokenService.expireTime.save(+new Date() / 1000 + data.result.expirySeconds)
  TokenService.permissions.save(data.result.permissions)
  TokenService.orgType.save(data.result.organizationType)
}

export async function logout(refreshToken: string) {
  const { data } = await api.put(auth + `/LogOut?refreshToken=${refreshToken}`)
  return data?.result
}

export async function checkTokenValid() {
  const { data } = await api.get(auth + '/CheckValidToken')
  return data
}
