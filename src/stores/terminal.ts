import { defineStore } from 'pinia'
import * as api from '@/api/terminal'
import { ref } from 'vue'

export const useTerminalStore = defineStore('terminal', () => {
  const list = ref([])
  const totalPages = ref(null)
  const totalCount = ref(null)

  async function getTerminals(payload: any) {
    const data = await api.getTerminals(payload)

    list.value = data.data?.result || []
    totalPages.value = data.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalPages
      : 1
    totalCount.value = data.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalCount
      : 1

    return list.value
  }

  async function getGateTypes() {
    const data = await api.getGateTypes()
    return data
  }

  async function getOrganizationIntegrateSystems(orgId: number) {
    const data = await api.getOrganizationIntegrateSystems(orgId)
    return data
  }

  async function getBankList() {
    const data = await api.getBankList()
    return data
  }

  async function addTerminal(payload: any) {
    const data = await api.addTerminal(payload)
    return data
  }

  async function editTerminal(payload: any) {
    const data = await api.editTerminal(payload)
    return data
  }

  async function getTerminalById(id: number) {
    const data = await api.getTerminalById(id)
    return data
  }

  async function getEposByBranch(id: number) {
    const data = await api.getEposByBranch(id)
    return data
  }

  return {
    list,
    totalPages,
    totalCount,
    getTerminals,
    getGateTypes,
    getOrganizationIntegrateSystems,
    getBankList,
    addTerminal,
    editTerminal,
    getTerminalById,
    getEposByBranch
  }
})
