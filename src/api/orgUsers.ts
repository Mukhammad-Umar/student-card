import {api} from "@/plugins/axios";

const admin = "api-core/OrganizationUser";

export async function getList(payload: any) {
  const data = await api.get(admin + "/Get", {
    params: payload,
  });
  return data;
}

export async function getOrganizations() {
  const {data} = await api.get(admin + "/GetOrganizations");
  return data;
}

export async function create(payload: any) {
  const {data} = await api.post(admin + "/Add", payload);
  return data;
}

export async function getOne(id: number) {
  const {data} = await api.get(admin + `/Get/${id}`);
  return data;
}

export async function edit(payload: any) {
  const {data} = await api.put(admin + "/Update", payload);
  return data;
}

export async function getRoles(payload: any) {
  const {data} = await api.get(admin + "/GetOrganizaionRoles", {
    params: payload,
  });
  return data;
}

export async function getOrganizaionRoles(orgId: number) {
  const {data} = await api.get(admin + `/GetOrganizaionRoles/${orgId}`);
  return data;
}

export async function changePassword(payload: any) {
  const {data} = await api.patch(admin + "/ChangePassword", payload);
  return data;
}
