import * as api from '@/api/autopayFile'
import { defineStore } from 'pinia'

export const useAutopayFileStore = defineStore('autopayFile', () => {
  async function getCurrentDateFiles(payload: any) {
    const data = await api.getCurrentDateFiles(payload)

    return {
      list: data?.data?.result || [],
      totalPages: data?.headers['x-pagination']
        ? JSON.parse(data?.headers['x-pagination']).TotalPages
        : 1,
      totalCount: data?.headers['x-pagination']
        ? JSON.parse(data?.headers['x-pagination']).TotalCount
        : 1,
    }
  }

  async function getArchiveFiles(payload: any) {
    const data = await api.getArchiveFiles(payload)

    return {
      list: data?.data?.result || [],
      totalPages: data?.headers['x-pagination']
        ? JSON.parse(data?.headers['x-pagination']).TotalPages
        : 1,
      totalCount: data?.headers['x-pagination']
        ? JSON.parse(data?.headers['x-pagination']).TotalCount
        : 1,
    }
  }

  async function getFileInfoByFileId(payload: any) {
    const data = await api.getFileInfoByFileId(payload)

    return {
      list: data?.data?.result || [],
      totalPages: data?.headers['x-pagination']
        ? JSON.parse(data?.headers['x-pagination']).TotalPages
        : 1,
      totalCount: data?.headers['x-pagination']
        ? JSON.parse(data?.headers['x-pagination']).TotalCount
        : 1,
    }
  }

  async function getActionList() {
    const data = await api.getActionList()
    return data
  }

  async function getFileStatus() {
    const data = await api.getFileStatus()
    return data
  }

  async function downloadErrorByFileId(fileId: number) {
    const data = await api.downloadErrorByFileId(fileId)
    return data
  }

  async function downloadSuccessByFileId(fileId: number) {
    const data = await api.downloadSuccessByFileId(fileId)
    return data
  }

  async function stopFileProcessing(payload: any) {
    const data = await api.stopFileProcessing(payload)
    return data
  }

  return {
    getCurrentDateFiles,
    getArchiveFiles,
    getFileInfoByFileId,
    getActionList,
    getFileStatus,
    downloadErrorByFileId,
    downloadSuccessByFileId,
    stopFileProcessing,
  }
})
