import * as api from "@/api/card";
import { defineStore } from "pinia";

export const useCardStore = defineStore("card", () => {
  async function sendToPrint(payload: any) {
    const { data } = await api.sendToPrint(payload);
    return data;
  }

  return {
    sendToPrint,
  };
});
