import {api} from "@/plugins/axios";

const admin = "api-admin/SystemConstants";

export async function getSystemConstants(payload: any) {
  const data = await api.get(admin + "/GetSystemConstants", {
    params: payload
  })
  return data
}

export async function editIntegrationSystems(payload: any) {
  const {data} = await api.put(admin + "/UpdateSystemConstant", payload)
  return data
}