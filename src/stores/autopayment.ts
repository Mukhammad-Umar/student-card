import * as api from "@/api/autopayment";
import {defineStore} from "pinia";
import {ref} from "vue";

export const useAutopaymentStore = defineStore("autopayment", () => {
  const list = ref([]);
  const countInfo = ref(null);
  const totalPages = ref(null);
  const totalCount = ref(null);

  async function getAutopayments(payload: any) {
    const data = await api.getAutopayments(payload);

    list.value = data.data?.result || [];
    countInfo.value = data.headers["x-autopayment-sum"] ? JSON.parse(data.headers["x-autopayment-sum"]) : null
    totalPages.value = data.headers["x-pagination"]
      ? JSON.parse(data?.headers["x-pagination"]).TotalPages
      : 1;
    totalCount.value = data.headers["x-pagination"]
      ? JSON.parse(data?.headers["x-pagination"]).TotalCount
      : 1;

    return list.value;
  }

  async function getAutopaymentsByContract(payload: any) {
    const data = await api.getAutopaymentsByContract(payload);
    return data;
  }

  async function getClients(payload: any) {
    const data = await api.getClients(payload);
    return data;
  }

  async function getContracts(payload: any) {
    const data = await api.getContracts(payload);
    return data;
  }

  async function addAutopayment(payload: any) {
    const data = await api.addAutopayment(payload);
    return data;
  }

  async function getById(id: any) {
    const data = await api.getById(id);
    return data;
  }

  async function getAutoPaymentStatus() {
    const data = await api.getAutoPaymentStatus();
    return data;
  }

  async function getActionStates() {
    const data = await api.getActionStates();
    return data;
  }

  async function changeStatusAllAutoPayments(payload: any) {
    const data = await api.changeStatusAllAutoPayments(payload);
    return data;
  }

  async function changeStatusBySelect(payload: any) {
    const data = await api.changeStatusBySelect(payload);
    return data;
  }

  async function changeRecomendedAmount(autopaymentId: string) {
    const data = await api.changeRecomendedAmount(autopaymentId);
    return data;
  }

  async function downloadAutopayments(payload: any) {
    const data = await api.downloadAutopayments(payload);
    return data;
  }

  return {
    list,
    countInfo,
    totalPages,
    totalCount,
    getAutopayments,
    getAutopaymentsByContract,
    getClients,
    getContracts,
    addAutopayment,
    getById,
    getAutoPaymentStatus,
    getActionStates,
    changeStatusAllAutoPayments,
    changeStatusBySelect,
    changeRecomendedAmount,
    downloadAutopayments,
  };
});
