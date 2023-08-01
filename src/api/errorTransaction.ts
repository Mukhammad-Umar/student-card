import { api } from '@/plugins/axios'

const admin = 'api-systeminfo/OrganizationErrorTransactions'

export async function getErrorTransactions(payload: any) {
  const data = await api.get(admin + '/GetTransactions', {
    params: payload
  })
  return data
}

export async function getErrorTransactionById(tranId: any) {
  const { data } = await api.get(admin + `/GetTransaction?transactionId=${tranId}`)
  return data
}

export async function GetTransactionsByAutopaymentId(payload: any) {
  const { data } = await api.get(admin + '/GetTransactionsByAutopaymentId', {
    params: payload
  })
  return data
}
