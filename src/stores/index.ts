import { defineStore, acceptHMRUpdate } from 'pinia'
import { URL_IMG } from '@/defaults'

export const mainStore = defineStore('main', {
  state: () => ({
    filterData: {},
    imgUrl: URL_IMG,
    currLocale: localStorage.getItem('locale') || 'ru',
    orgType: Number(localStorage.getItem('orgType')) ?? 0
  }),
  getters: {},
  actions: {}
})

export const systemCardsStore = defineStore('systemCards', {
  state: () => ({
    CARD_TYPE: {
      UZCARD: 'Uzcard',
      HUMO: 'Humo Card',
      MIR: 'Mir Card',
      UNION: 'Union Pay',
      MASTER: 'Master Card',
      VISA: 'Visa'
    }
  })
})

if (import.meta.hot) {
  // to auto update data in devTools
  import.meta.hot.accept(acceptHMRUpdate(mainStore, import.meta.hot))
}
