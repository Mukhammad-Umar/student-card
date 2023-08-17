import { api } from '@/plugins/axios'

const core = 'core'

export async function getUsers() {
  const { data } = await api.get(core + '/users/')
  return data
}

export async function getUniversities() {
  const { data } = await api.get(core + '/universities/')
  return data
}

export async function getProcessLogs(studentId: number) {
  const { data } = await api.get(core + `/journal/${studentId}/`)
  return data
}
