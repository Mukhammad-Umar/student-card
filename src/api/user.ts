import { api } from "@/plugins/axios";

const user = "api-core/Account";

export async function getMe() {
  const { data } = await api.get(user + "/GetMe");
  return data?.result;
}

export async function updateMe(payload: any) {
  const { data } = await api.put(user + "/UpdateMe", payload);
  return data;
}

export async function changePassword(payload: any) {
  const { data } = await api.put(user + "/ChangePassword", payload);
  return data;
}
