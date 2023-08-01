export type Login = {
  login: string
  clientId: string
  password: string
  organizationType: number | undefined
}

export type DashAllAmount = {
  typeId: number
}

export type DashTranInfoByPeriod = {
  endDate: string
  startDate: string
}
