import * as api from "@/api/role"
import { defineStore } from "pinia";
import { ref } from "vue"

export const useRoleStore = defineStore("role", () => {
  const list = ref([]);
  const totalPages = ref(null);
  const totalCount = ref(null);

  async function getList(payload: any) {
    const data = await api.getList(payload);

    list.value = data.data?.result || [];
    totalPages.value = data.headers["x-pagination"]
      ? JSON.parse(data?.headers["x-pagination"]).TotalPages
      : 1;
    totalCount.value = data.headers["x-pagination"]
      ? JSON.parse(data?.headers["x-pagination"]).TotalCount
      : 1;

    return list.value;
  }

  async function getById(roleId: number) {
    const data = await api.getById(roleId);
    return data;
  }

  async function getRoleMenus(roleId: number) {
    const data = await api.getRoleMenus(roleId);
    return data;
  }

  async function getRoleFunctionals(payload: any) {
    const data = await api.getRoleFunctionals(payload);
    return data;
  }

  async function getRoleUsersWithoutRole(roleId: number) {
    const data = await api.getRoleUsersWithoutRole(roleId);
    return data;
  }

  async function editRole(payload: any) {
    const data = await api.editRole(payload);
    return data;
  }

  async function getMenus() {
    const data = await api.getMenus();
    return data;
  }

  async function getFunctionals(payload: any) {
    const data = await api.getFunctionals(payload);
    return data;
  }

  async function getUsersWithoutRole() {
    const data = await api.getUsersWithoutRole();
    return data;
  }

  async function addRole(payload: any) {
    const data = await api.addRole(payload);
    return data;
  }

  return {
    totalPages,
    totalCount,
    list,
    getList,
    getById,
    getRoleMenus,
    getRoleFunctionals,
    getRoleUsersWithoutRole,
    editRole,
    getMenus,
    getFunctionals,
    getUsersWithoutRole,
    addRole,
  }
})