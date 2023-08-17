import { defineStore } from "pinia";
import * as api from "@/api/user";
import TokenService from "@/service/TokenService";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const userInfo = ref({});

  async function setLoginData(payload: any) {
    userInfo.value = payload.user
    TokenService.token.save(payload.token)
  }

  async function setToken(payload: any) {
    TokenService.token.save(payload);
  }

  async function removeToken() {
    TokenService.token.remove();
  }

  async function getMe() {
    const data = await api.getMe();
    userInfo.value = data;
    return data;
  }

  async function updateMe(payload: any) {
    const data = await api.updateMe(payload);
    return data?.result;
  }

  async function changePassword(payload: any) {
    const data = await api.changePassword(payload);
    return data?.result;
  }

  return {
    setLoginData,
    setToken,
    removeToken,
    getMe,
    updateMe,
    changePassword,
    userInfo,
  };
});
