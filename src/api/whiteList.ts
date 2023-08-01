import { api } from '@/plugins/axios'

const admin = 'api-debtor/OrganizationExcludeDebtors'

export async function getList(payload: any) {
  const data = await api.get(admin + '/Get', {
    params: payload
  })
  return data
}

export async function checkPinfl(pinfl: string) {
  const { data } = await api.get(admin + `/GetClientByPinfl/${pinfl}`)
  return data
}

export async function addPayer(payload: any) {
  const { data } = await api.post(admin + '/Add', payload)
  return data
}

export async function getById(excludeId: number) {
  const { data } = await api.get(admin + `/Get/${excludeId}`)
  return data
}

export async function removePayer(excludeId: number) {
  const { data } = await api.delete(admin + `/Delete/${excludeId}`)
  return data
}

export async function removeByOrganizationDebtor(debtorId: number) {
  const { data } = await api.delete(admin + `/DeleteByOrganizationDebtor/${debtorId}`)
  return data
}
