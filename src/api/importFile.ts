import { api } from '@/plugins/axios'

const importPath = 'api-file/ImportAutopaymentFiles'

export async function getBranches() {
  const { data } = await api.get(importPath + '/Branches')
  return data
}

export async function getTerminalGroups(organizationBranchId: number) {
  const { data } = await api.get(importPath + `/GetTerminalGroups?organizationBranchId=${organizationBranchId}`)
  return data
}

export async function getActionStates() {
  const { data } = await api.get(importPath + '/GetActionStates')
  return data
}

export async function importFile(payload: any) {
  const { data } = await api.post(importPath + '/ImportFile', payload)
  return data
}