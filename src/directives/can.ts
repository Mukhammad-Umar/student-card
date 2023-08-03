import { permissions } from '@/service/TokenService'

const can = {
  beforeMount: (el: any, binding: any, vnode: any) => {
    const { value } = binding
    if (value[0] === 'all') {
      return true
    } else {
      let hasPermission = false
      const permissionList = JSON.parse(permissions.get())
      if (permissionList) {
        if (value && value instanceof Array && value.length > 0) {
          value.forEach((element) => {
            hasPermission = hasPermission || permissionList.some((perm: any) => perm === element)
          })
        } else {
          hasPermission = hasPermission || permissionList.some((perm: any) => perm === value)
        }
      }
      if (!hasPermission) {
        el.style.display = 'none'
      }
    }
  }
}

export default can
