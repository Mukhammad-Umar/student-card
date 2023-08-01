import { defineStore } from 'pinia'
import * as api from '@/api/whiteList'
import { ref } from 'vue'

export const useWhiteListStore = defineStore('whiteList', () => {
  const list = ref([])
  const totalPages = ref(null)
  const totalCount = ref(null)

  async function getList(payload: any) {
    const data = await api.getList(payload)

    list.value = data.data?.result || []
    totalPages.value = data.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalPages
      : 1
    totalCount.value = data.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalCount
      : 1

    return list.value
  }

  async function checkPinfl(pinfl: string) {
    const data = await api.checkPinfl(pinfl)
    return data
  }

  async function addPayer(payload: any) {
    const data = await api.addPayer(payload)
    return data
  }

  async function getById(excludeId: number) {
    const data = await api.getById(excludeId)
    return data
  }

  async function removePayer(excludeId: number) {
    const data = await api.removePayer(excludeId)
    return data
  }

  async function removeByOrganizationDebtor(excludeId: number) {
    const data = await api.removeByOrganizationDebtor(excludeId)
    return data
  }

  return {
    list,
    totalPages,
    totalCount,
    getList,
    checkPinfl,
    addPayer,
    getById,
    removePayer,
    removeByOrganizationDebtor
  }
})
