import { api } from "@/plugins/axios";

const filePath = "api-file/ImportedFileInfos";

export async function getCurrentDateFiles(payload: any) {
  const data = await api.get(filePath + "/GetCurrentDateFiles", {
    params: payload,
  });
  return data;
}

export async function getArchiveFiles(payload: any) {
  const data = await api.get(filePath + "/GetArchiveFiles", {
    params: payload,
  });
  return data;
}

export async function getFileInfoByFileId(payload: any) {
  const data = await api.get(filePath + "/GetFileInfoByFileId", {
    params: payload,
  });
  return data;
}

export async function getActionList() {
  const { data } = await api.get(filePath + "/GetRecordActionStateList");
  return data;
}

export async function getFileStatus() {
  const { data } = await api.get(filePath + "/GetFileStatusList");
  return data;
}

export async function downloadErrorByFileId(fileId: number) {
  const { data } = await api.get(filePath + `/ExportErrorFileItemsByFileId/${fileId}`, {responseType: 'blob'});
  return data;
}

export async function downloadSuccessByFileId(fileId: number) {
  const { data } = await api.get(filePath + `/ExportAllFileItemsByFileId/${fileId}`, {responseType: 'blob'});
  return data;
}

export async function stopFileProcessing(payload: any) {
  const { data } = await api.patch(filePath + "/FinishedProcessingFileByFileId", payload);
  return data;
}
