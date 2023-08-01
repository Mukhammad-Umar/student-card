import * as api from "@/api/card";
import { defineStore } from "pinia";

export const useCardStore = defineStore("card", () => {
  async function getCards(payload: any) {
    const { data } = await api.getCards(payload);
    return data;
  }

  async function getActivateCards(clientId: string) {
    const { data } = await api.getActivateCards(clientId);
    return data;
  }

  async function getBlockedCards(payload: any) {
    const { data } = await api.getBlockedCards(payload);
    return data;
  }

  async function setBlockCard(payload: any) {
    const { data } = await api.setBlockCard(payload);
    return data;
  }

  async function setUnblockCard(payload: any) {
    const { data } = await api.setUnblockCard(payload);
    return data;
  }

  async function verifyCard(payload: any) {
    const { data } = await api.verifyCard(payload);
    return data;
  }

  async function addCard(payload: any) {
    const data = await api.addCard(payload);
    return data;
  }

  async function getBalance(payload: any) {
    const data = await api.getBalance(payload);
    return data;
  }

  return {
    getCards,
    getActivateCards,
    getBlockedCards,
    setBlockCard,
    setUnblockCard,
    verifyCard,
    addCard,
    getBalance,
  };
});
