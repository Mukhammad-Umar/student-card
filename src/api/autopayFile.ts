import { api } from "@/plugins/axios";

const filePath = "student_data_hemis";

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
  const upload_id = payload.upload_id
  payload.upload_id = null
  const { data } = await api.get(filePath + `/students_in_upload/${upload_id}/?`, {
    params: payload
  })
  return data;
}
