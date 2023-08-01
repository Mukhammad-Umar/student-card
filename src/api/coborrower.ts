import { api } from '@/plugins/axios'

const admin = 'api-debtor/OrganizationWClientContracts'

export async function getClients(payload: any) {
  const data = await api.get(admin + '/Get', {
    params: payload
  })
  return data
}

export async function addClientContract(payload: any) {
  const { data } = await api.post(admin + '/AddClientContract', payload)
  return data
}

export async function checkPinfl(pinfl: string) {
  const { data } = await api.get(admin + `/GetClientByPinfl/${pinfl}`)
  return data
}

export async function getById(id: any) {
  const { data } = await api.get(admin + `/Get/${id}`)
  return data
}

export async function getExcludeClient(organizationDebtorId: string) {
  const { data } = await api.get(admin + `/CheckExcludedDebtor/${organizationDebtorId}`)
  return data
}

export async function getContracts(payload: any) {
  const data = await api.get(admin + '/GetContracts', {
    params: payload
  })
  return data
}

export async function getTransactions(payload: any) {
  const data = await api.get(admin + '/GetTransactions', {
    params: payload
  })
  return data
}

export async function getWClients(contractId: string) {
  const { data } = await api.get(admin + `/GetWClients/${contractId}`)
  return data
}

export async function updateWClientState(payload: any) {
  const { data } = await api.patch(admin + `/UpdateWClientState/?wclientId=${payload.wclientId}&state=${payload.state}`)
  return data
}

export async function downloadPayers(payload: any) {
  const { data } = await api.get(admin + '/DownloadClientContracts', {
    params: payload,
    responseType: 'blob'
  })
  return data
}
