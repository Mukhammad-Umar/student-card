import { api } from '@/plugins/axios'

const files = 'api-file/Files'

export async function getFolderName() {
  const { data } = await api.get(files + '/FileFolderTypes')
  return data
}

export async function addFile(payload: any) {
  const { data } = await api.post(files + '/AddFile', payload)
  return data
}

export async function removeFile(payload: any) {
  const { data } = await api.patch(files + '/RemoveFile', payload)
  return data
}

export async function getFile(payload: any) {
  const { data } = await api.patch(files + '/GetFile', payload, { responseType: 'blob' })
  return data
}
