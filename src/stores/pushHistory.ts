import { defineStore } from 'pinia'
import * as api from '@/api/pushHistory'
import { ref } from 'vue'

export const usePushHistoryStore = defineStore('pushHistory', () => {
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

  async function getById(payload: any) {
    const data = await api.getById(payload)
    return data
  }

  async function retrySendPush(payload: any) {
    const data = await api.retrySendPush(payload)
    return data
  }

  async function getPushTypes() {
    const data = await api.getPushTypes()
    return data
  }

  async function getPushStates() {
    const data = await api.getPushStates()
    return data
  }

  async function getTransactionReverseState() {
    const data = await api.getTransactionReverseState()
    return data
  }

  async function getOrganizations() {
    const data = await api.getOrganizations()
    return data
  }

  return {
    list,
    totalPages,
    totalCount,
    getList,
    getById,
    retrySendPush,
    getPushTypes,
    getPushStates,
    getTransactionReverseState,
    getOrganizations
  }
})
