import { api } from '@/plugins/axios'

const admin = 'api-admin/IntegrationSystems'

export async function getIntegrationSystems(payload: any) {
  const data = await api.get(admin + '/Get', {
    params: payload
  })
  return data
}

export async function editIntegrationSystems(payload: any) {
  const { data } = await api.put(admin + '/Update', payload)
  return data
}

export async function getIntegrationSystemsById(sysId: number) {
  const { data } = await api.get(admin + `/Get/${sysId}`)
  return data
}
export async function getIntegrationSystemTypes() {
  const { data } = await api.get(admin + '/GetIntegrationSystemTypes')
  return data
}

export async function checkLoginPassword(payload: any) {
  const { data } = await api.patch(admin + '/CheckLoginPassword', payload)
  return data
}
