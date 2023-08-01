import { api } from '@/plugins/axios'

const user = 'api-debtor/OrganizationTransaction'

export async function getTransactions(payload: any) {
  const data = await api.get(user + '/GetTransactions', {
    params: payload
  })
  return data
}

export async function getTransactionById(id: any) {
  const { data } = await api.get(user + `/GetTransaction?transactionId=${id}`)
  return data
}

export async function getTransactionsByAutopaymentId(payload: any) {
  const data = await api.get(user + '/GetTransactionsByAutopaymentId', {
    params: payload
  })
  return data
}

export async function downloadTransactions(payload: any) {
  const { data } = await api.get(user + '/DownloadTransactions', {
    params: payload,
    responseType: 'blob'
  })
  return data
}


const userRev = 'api-debtor/OrganizationReverseTransaction'

export async function getTransactionByRefNum(refNum: string) {
  const { data } = await api.get(userRev + `/GetTransaction/${refNum}`)
  return data
}

export async function reversalTransaction(refNum: string) {
  const { data } = await api.patch(userRev + `/ReverseTransaction/${refNum}`)
  return data
}
