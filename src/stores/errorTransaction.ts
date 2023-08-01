import { defineStore } from 'pinia'
import * as api from '@/api/errorTransaction'
import { ref } from 'vue'

export const useErrorTransactionStore = defineStore('errorTransaction', () => {
  const list = ref([])
  const totalPages = ref(null)
  const totalCount = ref(null)

  async function getErrorTransactions(payload: any) {
    const data = await api.getErrorTransactions(payload)

    list.value = data?.data || []
    totalPages.value = data.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalPages
      : 1
    totalCount.value = data.headers['x-pagination']
      ? JSON.parse(data?.headers['x-pagination']).TotalCount
      : 1

    return list.value
  }

  async function getErrorTransactionById(tranId: any) {
    const data = await api.getErrorTransactionById(tranId)
    return data
  }

  async function GetTransactionsByAutopaymentId(payload: any) {
    const data = await api.GetTransactionsByAutopaymentId(payload)
    return data
  }

  return {
    list,
    totalPages,
    totalCount,
    getErrorTransactions,
    getErrorTransactionById,
    GetTransactionsByAutopaymentId
  }
})
