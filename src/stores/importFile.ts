import * as api from '../api/importFile'
import { defineStore } from 'pinia'

export const useImportFileStore = defineStore('importFile', () => {
  async function getBranches() {
    const data = await api.getBranches()
    return data
  }

  async function getImportedFiles(payload: any) {
    const data = await api.getImportedFiles(payload)
    return data
  }

  async function getActionStates() {
    const data = await api.getActionStates()
    return data
  }

  async function importFile(payload: any) {
    const data = await api.importFile(payload)
    return data
  }

  return {
    getBranches,
    getImportedFiles,
    getActionStates,
    importFile,
  }
})
