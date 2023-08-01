import { api } from "@/plugins/axios"

const role = "api-core/OrganizationRoles"

export async function getList(payload: any) {
  const data = await api.get(role + "/GetRoles", {
    params: payload
  })
  return data
}

export async function getById(roleId: number) {
  const {data} = await api.get(role + `/GetRole/${roleId}`)
  return data
}

export async function getRoleMenus(roleId: number) {
  const {data} = await api.get(role + `/GetRoleMenus/${roleId}`)
  return data
}

export async function getRoleFunctionals(payload: any) {
  const {data} = await api.patch(role + "/GetRoleFunctionals", payload)
  return data
}

export async function getRoleUsersWithoutRole(roleId: number) {
  const {data} = await api.get(role + `/GetRoleUsers/${roleId}`)
  return data
}

export async function editRole(payload: any) {
  const {data} = await api.put(role + "/Update", payload)
  return data
}


const newRole = "api-core/OrganizationCreateRoles"

export async function getMenus() {
  const {data} = await api.get(newRole + "/GetMenus");
  return data;
}

export async function getFunctionals(payload: any) {
  const {data} = await api.patch(newRole + "/GetFunctionals", payload);
  return data;
}

export async function getUsersWithoutRole() {
  const {data} = await api.get(newRole + "/GetUsersWithoutRole");
  return data;
}

export async function addRole(payload: any) {
  const {data} = await api.post(newRole + "/Add", payload)
  return data
}