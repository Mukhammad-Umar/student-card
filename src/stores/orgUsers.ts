import { defineStore } from 'pinia'
import * as api from '@/api/orgUsers'
import { ref } from 'vue'

export const useOrgUserStore = defineStore('orgUsers', () => {
  const list = ref([])
  const totalPages = ref(null)
  const totalCount = ref(null)

  async function getList(payload: any) {
    const data = await api.getList(payload)

    totalPages.value = JSON.parse(data.headers['x-pagination']).TotalPages
    totalCount.value = JSON.parse(data.headers['x-pagination']).TotalCount
    list.value = data.data?.result ?? []
    return list.value
  }

  async function getOrganizations() {
    const data = await api.getOrganizations()
    return data
  }

  async function create(payload: any) {
    const data = await api.create(payload)
    return data
  }

  async function getOne(id: number) {
    const data = await api.getOne(id)
    return data
  }

  async function edit(payload: any) {
    const data = await api.edit(payload)
    return data
  }

  async function getRoles(payload: any) {
    const data = await api.getRoles(payload)
    return data
  }

  async function getOrganizaionRoles(orgId: number) {
    const data = await api.getOrganizaionRoles(orgId)
    return data
  }

  async function changePassword(payload: any) {
    const data = await api.changePassword(payload)
    return data
  }

  return {
    totalPages,
    totalCount,
    list,
    getList,
    getOrganizations,
    create,
    getOne,
    edit,
    getRoles,
    changePassword,
    getOrganizaionRoles
  }
})
