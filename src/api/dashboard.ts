import { api } from '@/plugins/axios'
import type { DashAllAmount, DashTranInfoByPeriod } from '@/utils/apiTypes'

const admin = 'api-debtor/Homepage'

export async function getAllHeaderTypes() {
  const { data } = await api.get(admin + '/GetAllHeaderTypes')
  return data
}

export async function getHeaderInfo(payload: DashAllAmount) {
  const { data } = await api.get(admin + '/GetHeaderInfo', {
    params: payload
  })
  return data
}

export async function getAllFooterTypes() {
  const { data } = await api.get(admin + '/GetAllFooterTypes')
  return data
}

export async function getFooterInfo(payload: any) {
  const { data } = await api.get(admin + '/GetFooterInfo', {
    params: payload
  })
  return data
}

export async function getAllDashboardInfoTypes() {
  const { data } = await api.get(admin + '/GetAllDashboardInfoTypes')
  return data
}

export async function getAllAmountInfo(payload: DashAllAmount) {
  const { data } = await api.get(admin + '/GetAllAmountInfo', {
    params: payload
  })
  return data
}

export async function getAutopaymentCountInfo(orgId: number) {
  const { data } = await api.get(admin + '/GetAutopaymentCountInfo', {
    params: {
      organizationId: orgId
    }
  })
  return data
}

export async function getOtherInfo(payload: any) {
  const { data } = await api.get(admin + '/GetOtherInfo', {
    params: payload
  })
  return data
}

export async function getCurrentDateTransactionInfo(orgId: number) {
  const { data } = await api.get(admin + '/GetCurrentDateTransactionInfo', {
    params: {
      organizationId: orgId
    }
  })
  return data
}

export async function getTransactionInfoByMonth(payload: any) {
  const { data } = await api.get(admin + '/GetTransactionInfoByMonth', {
    params: payload
  })
  return data
}

export async function getTransactionInfoByPeriod(payload: DashTranInfoByPeriod) {
  const { data } = await api.get(admin + '/GetTransactionInfoByPeriod', {
    params: payload
  })
  return data
}
