import { api } from '@/plugins/axios'

const admin = 'api-systeminfo/PushHistory'

export async function getList(payload: any) {
  const data = await api.get(admin + '/Get', {
    params: payload
  })
  return data
}

export async function getById(payload: any) {
  const { data } = await api.get(admin + '/GetById', {
    params: payload
  })
  return data
}

export async function retrySendPush(payload: any) {
  const { data } = await api.get(admin + '/RetrySendPush', {
    params: payload
  })
  return data
}

export async function getPushTypes() {
  const { data } = await api.get(admin + '/GetPushTypes')
  return data
}

export async function getPushStates() {
  const { data } = await api.get(admin + '/GetPushStates')
  return data
}

export async function getTransactionReverseState() {
  const { data } = await api.get(admin + '/GetTransactionReverseState')
  return data
}

export async function getOrganizations() {
  const { data } = await api.get(admin + '/GetOrganizations')
  return data
}
