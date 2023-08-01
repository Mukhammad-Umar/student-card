import { api } from '@/plugins/axios'

const admin = 'api-clientinfo/OrganizationTerminalGroups'

export async function getTerminals(payload: any) {
  const data = await api.get(admin + '/Get', {
    params: payload
  })
  return data
}

export async function getGateTypes() {
  const { data } = await api.get(admin + '/GetGateTypes')
  return data
}

export async function getOrganizationIntegrateSystems(orgId: number) {
  const { data } = await api.get(admin + `/GetOrganizationIntegrateSystems/${orgId}`)
  return data
}

export async function getBankList() {
  const { data } = await api.get(admin + '/GetBankList')
  return data
}

export async function addTerminal(payload: any) {
  const { data } = await api.post(admin + '/Add', payload)
  return data
}

export async function editTerminal(payload: any) {
  const { data } = await api.put(admin + '/Update', payload)
  return data
}

export async function getTerminalById(id: number) {
  const { data } = await api(admin + `/Get/${id}`)
  return data
}

const userTer = 'api-clientinfo/OrganizationTerminalGroups'

export async function getEposByBranch(id: number) {
  const { data } = await api.get(userTer + `/GetForContract?organizationBranchId=${id}`)
  return data
}
