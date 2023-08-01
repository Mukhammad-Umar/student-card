import * as api from "../api/files"
import {defineStore} from "pinia";

export const useFilesStore = defineStore("files", () => {
  async function getFolderName() {
    const data = await api.getFolderName();
    return data;
  }

  async function addFile(payload: any) {
    const data = await api.addFile(payload);
    return data;
  }

  async function removeFile(payload: any) {
    const data = await api.removeFile(payload);
    return data;
  }

  async function getFile(payload: any) {
    const data = await api.getFile(payload);
    return data;
  }

  return {
    getFolderName,
    addFile,
    removeFile,
    getFile,
  }
})