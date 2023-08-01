import type { TokenService } from '@/utils/types'

const UNIQUE_DEVICE_ID = 'uid'
const TOKEN = 'Authorization'
const REFRESH_TOKEN = 'Refresh'
const EXPIRE_TIME = 'Expire'
const PERMISSIONS = 'Permission'
const PHONE_NUMBER = 'Phone'
const ORG_TYPE = 'OrgType'

export const deviceId: TokenService = {
  save(value: string) {
    localStorage.setItem(UNIQUE_DEVICE_ID, value)
  },
  get() {
    return localStorage.getItem(UNIQUE_DEVICE_ID)
  },
  remove() {
    localStorage.removeItem(UNIQUE_DEVICE_ID)
  }
}

export const token: TokenService = {
  save(value: string) {
    localStorage.setItem(TOKEN, value)
  },
  get() {
    return localStorage.getItem(TOKEN)
  },
  remove() {
    localStorage.removeItem(TOKEN)
  }
}

export const refreshToken: TokenService = {
  save(value: string) {
    localStorage.setItem(REFRESH_TOKEN, value)
  },
  get() {
    return localStorage.getItem(REFRESH_TOKEN)
  },
  remove() {
    localStorage.removeItem(REFRESH_TOKEN)
  }
}

export const expireTime: TokenService = {
  save(value: string) {
    localStorage.setItem(EXPIRE_TIME, value)
  },
  get() {
    return Number(localStorage.getItem(EXPIRE_TIME))
  },
  remove() {
    localStorage.removeItem(EXPIRE_TIME)
  }
}

export const permissions: TokenService = {
  save(permissions: string[]) {
    localStorage.setItem(PERMISSIONS, JSON.stringify(permissions))
  },
  get() {
    return localStorage.getItem(PERMISSIONS)
  },
  remove() {
    localStorage.removeItem(PERMISSIONS)
  }
}

export const phoneNumber: TokenService = {
  save(value: string) {
    localStorage.setItem(PHONE_NUMBER, value)
  },
  get() {
    return localStorage.getItem(PHONE_NUMBER)
  },
  remove() {
    localStorage.removeItem(PHONE_NUMBER)
  }
}

export const orgType: TokenService = {
  save(value: string) {
    localStorage.setItem(ORG_TYPE, value)
  },
  get() {
    return localStorage.getItem(ORG_TYPE)
  },
  remove() {
    localStorage.removeItem(ORG_TYPE)
  }
}

export function removeAllTokens() {
  token.remove()
  refreshToken.remove()
  expireTime.remove()
  permissions.remove()
  orgType.remove()
}

export default {
  deviceId,
  token,
  refreshToken,
  expireTime,
  permissions,
  phoneNumber,
  orgType,
  removeAllTokens
}
