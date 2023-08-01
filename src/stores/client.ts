import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as api from '@/api/client'

export const useClientStore = defineStore('client', () => {
  const list = ref([])
  const totalPages = ref(null)
  const totalCount = ref(null)

  async function getClients(payload: any) {
    const data = await api.getClients(payload)

    list.value = data.data?.result || []
    totalPages.value = data.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalPages
      : 1
    totalCount.value = data.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalCount
      : 1

    return list.value
  }

  async function addClientContract(payload: any) {
    const data = await api.addClientContract(payload)
    return data
  }

  async function checkPinfl(pinfl: string) {
    const data = await api.checkPinfl(pinfl)
    return data
  }

  async function getById(id: any) {
    const data = await api.getById(id)
    return data
  }

  async function getExcludeClient(organizationDebtorId: string) {
    const data = await api.getExcludeClient(organizationDebtorId)
    return data
  }

  async function getContracts(payload: any) {
    const data = await api.getContracts(payload)
    return data
  }

  async function getTransactions(payload: any) {
    const data = await api.getTransactions(payload)
    return data
  }

  async function getTerminalGroups(organizationBranchId: number) {
    const data = await api.getTerminalGroups(organizationBranchId);
    return data;
  }

  async function getWClients(contractId: string) {
    const data = await api.getWClients(contractId)
    return data
  }

  async function updateWClientState(payload: any) {
    const data = await api.updateWClientState(payload)
    return data
  }

  async function downloadPayers(payload: any) {
    const data = await api.downloadPayers(payload)
    return data
  }

  return {
    list,
    totalPages,
    totalCount,
    getClients,
    addClientContract,
    checkPinfl,
    getById,
    getExcludeClient,
    getContracts,
    getTransactions,
    getTerminalGroups,
    getWClients,
    updateWClientState,
    downloadPayers
  }
})
