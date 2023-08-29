import { api } from "@/plugins/axios";

const card = 'card'

export async function sendToPrint(payload: any) {
  const data = await api.post(card + "/emit/", payload);
  return data;
}
