import * as api from '@/api/core'
import { defineStore } from 'pinia'

export const useCoreStore = defineStore('core', () => {
  async function getUsers() {
    const data = await api.getUsers()
    return data
  }

  async function getUniversities() {
    const data = await api.getUniversities()
    return data
  }

  async function getProcessLogs(studentId: number) {
    const data = await api.getProcessLogs(studentId)
    return data
  }

  return {
    getUsers,
    getUniversities,
    getProcessLogs
  }
})
