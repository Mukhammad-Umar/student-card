import * as api from '@/api/dashboard'
import { defineStore } from 'pinia'
import type { DashAllAmount, DashTranInfoByPeriod } from '@/utils/apiTypes'

export const useDashboardStore = defineStore('dashboard', () => {
  async function getAllHeaderTypes() {
    const data = await api.getAllHeaderTypes()
    return data
  }

  async function getHeaderInfo(payload: DashAllAmount) {
    const data = await api.getHeaderInfo(payload)
    return data
  }

  async function getAllFooterTypes() {
    const data = await api.getAllFooterTypes()
    return data
  }

  async function getFooterInfo(payload: DashAllAmount) {
    const data = await api.getFooterInfo(payload)
    return data
  }

  async function getAllDashboardInfoTypes() {
    const data = await api.getAllDashboardInfoTypes()
    return data
  }

  async function getAllAmountInfo(payload: DashAllAmount) {
    const data = await api.getAllAmountInfo(payload)
    return data
  }

  async function getAutopaymentCountInfo(orgId: number) {
    const data = await api.getAutopaymentCountInfo(orgId)
    return data
  }

  async function getOtherInfo(payload: any) {
    const data = await api.getOtherInfo(payload)
    return data
  }

  async function getCurrentDateTransactionInfo(orgId: number) {
    const data = await api.getCurrentDateTransactionInfo(orgId)
    return data
  }

  async function getTransactionInfoByMonth(payload: any) {
    const data = await api.getTransactionInfoByMonth(payload)
    return data
  }

  async function getTransactionInfoByPeriod(payload: DashTranInfoByPeriod) {
    const data = await api.getTransactionInfoByPeriod(payload)
    return data
  }

  return {
    getAllHeaderTypes,
    getHeaderInfo,
    getAllFooterTypes,
    getFooterInfo,
    getAllDashboardInfoTypes,
    getAllAmountInfo,
    getAutopaymentCountInfo,
    getOtherInfo,
    getCurrentDateTransactionInfo,
    getTransactionInfoByMonth,
    getTransactionInfoByPeriod
  }
})
