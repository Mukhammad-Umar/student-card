import { defineStore } from 'pinia'
import * as api from '@/api/integrationSystem'
import { ref } from 'vue'

export const useIntegrationSystemStore = defineStore('integrationSystem', () => {
  const totalPages = ref(null)
  const totalCount = ref(null)

  async function getIntegrationSystems(payload: any) {
    const data = await api.getIntegrationSystems(payload)

    totalPages.value = data?.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalPages
      : 1
    totalCount.value = data?.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalCount
      : 1

    return data?.data?.result || []
  }

  async function editIntegrationSystems(payload: any) {
    const data = await api.editIntegrationSystems(payload)
    return data
  }

  async function getIntegrationSystemsById(sysId: number) {
    const data = await api.getIntegrationSystemsById(sysId)
    return data
  }

  async function getIntegrationSystemTypes() {
    const data = await api.getIntegrationSystemTypes()
    return data
  }

  async function checkLoginPassword(payload: any) {
    const data = await api.checkLoginPassword(payload)
    return data
  }

  return {
    totalPages,
    totalCount,
    checkLoginPassword,
    getIntegrationSystems,
    editIntegrationSystems,
    getIntegrationSystemsById,
    getIntegrationSystemTypes
  }
})
