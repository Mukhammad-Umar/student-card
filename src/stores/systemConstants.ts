import {defineStore} from "pinia";
import * as api from "@/api/systemConstants";
import {ref} from "vue";

export const useSystemConstantsStore = defineStore("systemConstants", () => {
  const totalPages = ref(null);
  const totalCount = ref(null);

  async function getSystemConstants(payload: any) {
    const data = await api.getSystemConstants(payload);

    totalPages.value = data?.headers["x-pagination"] ? JSON.parse(data?.headers["x-pagination"]).TotalPages : 1;
    totalCount.value = data?.headers["x-pagination"] ? JSON.parse(data?.headers["x-pagination"]).TotalCount : 1;

    return data?.data?.result || [];
  }

  async function editIntegrationSystems(payload: any) {
    const data = await api.editIntegrationSystems(payload);
    return data;
  }

  return {
    totalPages,
    totalCount,
    getSystemConstants,
    editIntegrationSystems,
  };
});