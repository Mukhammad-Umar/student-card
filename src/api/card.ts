import { api } from "@/plugins/axios";

const user = "api-debtor/OrganizationDebtorCard";

export async function getCards(payload: any) {
  const data = await api.get(user + "/Get", {
    params: payload,
  });
  return data;
}

export async function getActivateCards(clientId: string) {
  const data = await api.get(user + `/GetActivateCards?organizationDebtorId=${clientId}`);
  return data;
}

export async function getBlockedCards(payload: any) {
  const data = await api.get(user + '/GetBlockedCards', {
    params: payload
  });
  return data;
}

export async function setBlockCard(payload: any) {
  const data = await api.patch(user + `/SetBlockCard?organizationDebtorId=${payload.organizationDebtorId}&id=${payload.id}&integrationSystemId=${payload.integrationSystemId}`);
  return data;
}

export async function setUnblockCard(payload: any) {
  const data = await api.patch(user + `/SetUnblockCard?organizationDebtorId=${payload.organizationDebtorId}&id=${payload.id}&integrationSystemId=${payload.integrationSystemId}`);
  return data;
}

export async function verifyCard(payload: any) {
  const data = await api.patch(user + `/VerifyCard?organizationDebtorId=${payload.organizationDebtorId}&id=${payload.id}&integrationSystemId=${payload.integrationSystemId}`);
  return data;
}

export async function addCard(payload: any){
  const { data } = await api.post(user + "/AddCard", payload)
  return data
}

export async function getBalance(payload: any){
  const { data } = await api.patch(user + "/GetBalanceCards", payload)
  return data
}