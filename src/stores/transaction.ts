import { defineStore } from "pinia";
import * as api from "@/api/transaction";
import { ref } from "vue";

export const useTransactionStore = defineStore("transaction", () => {
  const list = ref([]);
  const countInfo = ref(null);
  const totalPages = ref(null);
  const totalCount = ref(null);

  async function getTransactions(payload: any) {
    const data = await api.getTransactions(payload);

    list.value = data.data?.result || [];
    countInfo.value = data.headers["x-transaction-sum"] ? JSON.parse(data.headers["x-transaction-sum"]) : null
    totalPages.value = data.headers["x-pagination"]
      ? JSON.parse(data?.headers["x-pagination"]).TotalPages
      : 1;
    totalCount.value = data.headers["x-pagination"]
      ? JSON.parse(data?.headers["x-pagination"]).TotalCount
      : 1;

    return list.value;
  }

  async function getTransactionById(id: any) {
    const data = await api.getTransactionById(id);
    return data;
  }

  async function getTransactionsByAutopaymentId(payload: any){
    const data = await api.getTransactionsByAutopaymentId(payload)
    return data
  }

  async function getTransactionByRefNum(refNum: string) {
    const data = await api.getTransactionByRefNum(refNum);
    return data;
  }

  async function reversalTransaction(refNum: string) {
    const data = await api.reversalTransaction(refNum);
    return data;
  }

  async function downloadTransactions(payload: any){
    const data = await api.downloadTransactions(payload)
    return data
  }

  return {
    list,
    countInfo,
    totalPages,
    totalCount,
    getTransactions,
    getTransactionById,
    getTransactionsByAutopaymentId,
    getTransactionByRefNum,
    reversalTransaction,
    downloadTransactions,
  }

})