import { Tooltip } from 'bootstrap'

export const tooltip = {
  beforeMount: (el: any, binding: any, vnode: any) => {
    const tooltip = new Tooltip(el, {
      title: binding.value,
      placement: 'bottom', // placement: binding.arg,  v-tooltip:bottom=""
      trigger: 'hover'
    })
  }
}
