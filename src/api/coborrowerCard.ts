import { api } from "@/plugins/axios";

const admin = "api-debtor/OrganizationWClientCard";

export async function getCards(payload: any) {
  const data = await api.get(admin + "/Get", {
    params: payload,
  });
  return data;
}

export async function getActivateCards(clientId: string) {
  const data = await api.get(admin + `/GetActivateCards?organizationDebtorId=${clientId}`);
  return data;
}

export async function getBlockedCards(payload: any) {
  const data = await api.get(admin + '/GetBlockedCards', {
    params: payload
  });
  return data;
}

export async function setBlockCard(payload: any) {
  const data = await api.patch(admin + `/SetBlockCard?organizationDebtorId=${payload.organizationDebtorId}&id=${payload.id}&integrationSystemId=${payload.integrationSystemId}`);
  return data;
}

export async function setUnblockCard(payload: any) {
  const data = await api.patch(admin + `/SetUnblockCard?organizationDebtorId=${payload.organizationDebtorId}&id=${payload.id}&integrationSystemId=${payload.integrationSystemId}`);
  return data;
}

export async function verifyCard(payload: any) {
  const data = await api.patch(admin + `/VerifyCard?organizationDebtorId=${payload.organizationDebtorId}&id=${payload.id}&integrationSystemId=${payload.integrationSystemId}`);
  return data;
}

export async function addCard(payload: any){
  const { data } = await api.post(admin + "/AddCard", payload)
  return data
}

export async function getHumoGateCardNumber(cardId: any){
  const { data } = await api.get(admin + `/getHumoGateCardNumber/${cardId}`)
  return data
}

export async function getBalance(payload: any){
  const { data } = await api.patch(admin + "/GetBalanceCards", payload)
  return data
}