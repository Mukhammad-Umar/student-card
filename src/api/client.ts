import { api } from '@/plugins/axios'

const admin = 'student_data_hemis'

export async function getClients(payload: any) {
  const data = await api.get(admin + '/students/', {
    params: payload
  })
  return data
}

export async function getById(id: any) {
  const { data } = await api.get(admin + `/students/${id}/`)
  return data
}

export async function downloadPayers(payload: any) {
  const { data } = await api.get(admin + '/DownloadClientContracts', {
    params: payload,
    responseType: 'blob'
  })
  return data
}
