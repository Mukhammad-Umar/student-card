import * as api from '@/api/branch'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBranchStore = defineStore('branch', () => {
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

  async function getBranches(payload?: any) {
    const data = await api.getBranches(payload)
    return data?.result
  }

  async function getOwnBranchId() {
    const data = await api.getOwnBranchId()
    return data?.result
  }

  async function getTerminalGroups() {
    const data = await api.getTerminalGroups()
    return data?.result
  }

  async function addBranch(payload: any) {
    const data = await api.addBranch(payload)
    return data
  }

  async function editBranch(payload: any) {
    const data = await api.editBranch(payload)
    return data
  }

  async function getById(id: number) {
    const data = await api.getById(id)
    return data
  }

  return {
    totalPages,
    totalCount,
    list,
    getList,
    getBranches,
    getOwnBranchId,
    getTerminalGroups,
    addBranch,
    editBranch,
    getById
  }
})
