import { api } from '@/plugins/axios'

const branch = 'api-core/Branches'

export async function getList(payload: any) {
  const data = await api.get(branch + '/Get', {
    params: payload
  })
  return data
}

export async function getById(id: number) {
  const { data } = await api.get(branch + `/Get/${id}`)
  return data
}

export async function addBranch(payload: any) {
  const { data } = await api.post(branch + '/Add', payload)
  return data
}

export async function editBranch(payload: any) {
  const { data } = await api.put(branch + '/Update', payload)
  return data
}

export async function getBranches(payload?: any) {
  const { data } = await api.get(branch + '/Branches', {
    params: payload
  })
  return data
}

export async function getTerminalGroups() {
  const { data } = await api.get(branch + '/GetTerminalGroups')
  return data
}

export async function getOwnBranchId() {
  const { data } = await api.get(branch + '/GetOwnBranchId')
  return data
}
