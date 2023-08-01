import Moment from 'moment'

export default {
  filterDate(val: string) {
    return Moment(val).isValid() ? Moment(val).format('DD.MM.YYYY') : ''
  },

  filterFullDate(val: string) {
    return val ? val.split('T')[0].split('-').reverse().join('.') : ''
  },

  filterMonthDate(val: string) {
    return Moment(val).isValid() ? Moment(val).format('MM.D.YYYY') : ''
  },

  filterDateAndTime(val: string) {
    return Moment(val).isValid() ? Moment(val).format('DD.MM.YYYY HH:mm:ss') : ''
  },

  filterDateWithHM(val: string) {
    return Moment(val).isValid() ? Moment(val).format('DD.MM.YYYY HH:mm') : ''
  },

  filterTimeAndDate(val: string) {
    return Moment(val).isValid() ? Moment(val).format('HH:mm:ss, D.MM.YYYY') : ''
  },

  filterDateFMonth(val: string) {
    return Moment(val).isValid() ? Moment(val).format('D MMMM, YYYY') : ''
  },

  filterTimeAndDateHMonth(val: string) {
    return Moment(val).isValid() ? Moment(val).format('D MMM YYYY, HH:mm') : ''
  },

  filterCapitalMonthYear(val: string) {
    const monthYear = Moment(val).isValid() ? Moment(val).format('MMMM YYYY') : ''
    return monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
  },

  filterCapitalMonthDay(val: string) {
    const monthYear = Moment(val).isValid() ? Moment(val).format('MMM DD') : ''
    return monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
  },

  filterCapitalWeek(val: string) {
    const monthYear = Moment(val).isValid() ? Moment(val).format('dd, MMM D') : ''
    return monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
  },

  filterCard(val: any) {
    return val.match(/.{1,4}/g).join(' ')
  },

  filterMoney(val: string | number) {
    return Number(val) ? Number(val).toLocaleString('ru-RU') : 0
  },

  withMaskedPercentage(val: string) {
    return parseInt(val.replace(/[^0-9]/g, '')) + parseInt(val.replace(/[^0-9]/g, '')) / 100
  },

  filterMoneyFraction(val: string | number) {
    return Number(val) ? (Number(val) / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2 }) : 0
  },

  filterPhoneNumber(val: string) {
    return val ? '(' + val.slice(0, 2) + ') ' + val.slice(2, 5) + '-' + val.slice(5, 7) + '-' + val.slice(7) : ''
  },

  filterFullPhoneNumber(val: string) {
    return val
      ? '+' + val.slice(0, 3) + ' ' + '(' + val.slice(3, 5) + ') ' + val.slice(5, 8) + '-' + val.slice(8, 10) + '-' + val.slice(10)
      : ''
  }
}
