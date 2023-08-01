import { api } from '@/plugins/axios'

const url = 'api-autopayment/OrganizationAutopayments'

export async function getAutopayments(payload: any) {
  const data = await api.get(url + '/GetAutopayments', {
    params: payload
  })
  return data
}

export async function getAutopaymentsByContract(payload: any) {
  const data = await api.get(url + '/GetClientAutopayments', {
    params: payload
  })
  return data
}

export async function getClients(payload: any) {
  const data = await api.get(url + '/GetOrganizationClients', {
    params: payload
  })
  return data
}

export async function getContracts(payload: any) {
  const data = await api.get(url + '/GetOrganizationContracts', {
    params: payload
  })
  return data
}

export async function addAutopayment(payload: any) {
  const { data } = await api.post(url + '/Add', payload)
  return data
}

export async function getById(id: any) {
  const { data } = await api.get(url + `/Get/${id}`)
  return data
}

export async function getAutoPaymentStatus() {
  const { data } = await api.get(url + '/GetAutoPaymentStatus')
  return data
}

export async function getActionStates() {
  const { data } = await api.get(url + '/GetActionStates')
  return data
}

export async function changeStatusAllAutoPayments(payload: any) {
  const { data } = await api.patch(url +
  `/ChangeStatusAllAutoPayments?OrganizationBranchId=${payload.organizationBranchId}&StatusId=${payload.statusId}`)
  return data
}

export async function changeStatusBySelect(payload: any) {
  const { data } = await api.put(url + '/ChangeStatusAllAutoPaymentsBySelectedIds', payload)
  return data
}

export async function changeRecomendedAmount(autopaymentId: string){
  const { data } = await api.get(url + `/ChangesRecommendedAmountByAutopaymentId?autopaymentId=${autopaymentId}`)
  return data;
}

export async function downloadAutopayments(payload: any) {
  const { data } = await api.get(url + '/DownloadAutopayments', {
    params: payload,
    responseType: 'blob'
  })
  return data
}
