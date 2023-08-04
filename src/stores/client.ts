import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as api from '@/api/client'

export const useClientStore = defineStore('client', () => {
  const list = ref([])
  const totalPages = ref(null)
  const totalCount = ref(null)

  async function getClients(payload: any) {
    const data = await api.getClients(payload)

    list.value = data.data || []
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

  async function getById(id: any) {
    const data = await api.getById(id)
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
    getById,
    downloadPayers
  }
})
