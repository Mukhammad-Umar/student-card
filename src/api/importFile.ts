import { api } from '@/plugins/axios'

const importPath = 'student_data_hemis'

export async function getBranches() {
  const { data } = await api.get(importPath + '/Branches')
  return data
}

export async function getImportedFiles(payload: any) {
  const { data } = await api.get('student_data_hemis/get_uploads/', {
    params: payload
  })
  return data
}

export async function getActionStates() {
  const { data } = await api.get(importPath + '/GetActionStates')
  return data
}

export async function importFile(payload: any) {
  const { data } = await api.post(importPath + '/load_data/', payload)
  return data
}
