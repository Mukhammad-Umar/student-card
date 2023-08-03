import {api} from "@/plugins/axios";

const admin = "api-admin/Users";

export async function getAdmins(payload: any) {
  const data = await api.get(admin + "/Get", {
    params: payload,
  });
  return data;
}

export async function addAdmin(payload: any) {
  const {data} = await api.post(admin + "/Add", payload)
  return data
}

export async function editAdmin(payload: any) {
  const {data} = await api.put(admin + "/Update", payload)
  return data
}

export async function getAdminById(userId: number) {
  const {data} = await api.get(admin + `/Get/${userId}`)
  return data
}

export async function changePassword(payload: any) {
  const {data} = await api.patch(admin + "/ChangePassword", payload);
  return data;
}