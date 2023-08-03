import {defineStore} from "pinia";
import * as api from "../api/admin"
import {ref} from "vue"

export const useAdminStore = defineStore("admin", () => {
  const list = ref([]);
  const totalPages = ref(null);
  const totalCount = ref(null);

  async function getAdmins(payload: any) {
    const data = await api.getAdmins(payload);

    list.value = data.data?.result || [];
    totalPages.value = data.headers["x-pagination"] ? JSON.parse(data?.headers["x-pagination"]).TotalPages : 1;
    totalCount.value = data.headers["x-pagination"] ? JSON.parse(data?.headers["x-pagination"]).TotalCount : 1;

    return list.value;
  }

  async function addAdmin(payload: any) {
    const data = await api.addAdmin(payload);
    return data;
  }

  async function editAdmin(payload: any) {
    const data = await api.editAdmin(payload);
    return data;
  }

  async function getAdminById(userId: number) {
    const data = await api.getAdminById(userId);
    return data;
  }

  async function changePassword(payload: any) {
    const data = await api.changePassword(payload);
    return data;
  }

  return {
    list,
    totalPages,
    totalCount,
    getAdmins,
    addAdmin,
    editAdmin,
    getAdminById,
    changePassword,
  }
})