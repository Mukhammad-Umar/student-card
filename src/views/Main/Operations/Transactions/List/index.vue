<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted } from 'vue'
import { useBranchStore } from '@/stores/branch'
import { useTransactionStore } from '@/stores/transaction'

import filters from '@/filters'
import ExportBtn from '@/components/Common/ExportBtn.vue'
import TableFilters from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'

const props: any = defineProps({
  filterData: Object
})

const { t } = useI18n()
const branchStore = useBranchStore()
const transactionStore = useTransactionStore()

const branches = ref([])
const rows: any = ref([])
const loading = ref(true)
const loadBtn = ref(false)
const exportRef: any = ref(null)
const numerationIndex = ref(1)

const clientTypes = [
  { id: null, name: 'Все должники' },
  { id: 0, name: 'Заемщики' },
  { id: 1, name: 'Созаемщики' },
  { id: 2, name: 'Поручители' }
]

const cardTypes = [
  { id: null, name: t('menus.allCards') },
  { id: 0, name: 'UzCard' },
  { id: 1, name: 'Humo' }
]

const transactionStates = [
  { id: 0, name: t('filters.allTransactions') },
  { id: 1, name: t('filters.wroteOffTransactions') },
  { id: 2, name: t('filters.canceledTransactions') }
]

const systemStates = [
  { id: 0, name: t('filters.allSystems') },
  { id: 1, name: 'GenesisGate' },
  { id: 2, name: 'HumoGate' },
  { id: 3, name: 'SvGate' },
]

const fields = computed(() => [
  { key: 'expand', label: '' },
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'refNum', label: t('filters.refNum'), class: 'text-center' },
  { key: 'fio', label: t('filters.fio') }, // sortable: true
  { key: 'organizationContractInfo', label: t('filters.contractId'), class: 'text-center' },
  { key: 'amount', label: t('amount'), class: 'text-center', formatter: (val: any) => filters.filterMoney(val / 100) },
  { key: 'pan', label: t('filters.cardNumber'), class: 'text-center text-nowrap', formatter: (val: any) => filters.filterCard(val) },
  { key: 'ext', label: t('filters.tranExt'), class: 'text-center' },
  { key: 'wclientTypeName', label: t('filters.clientType'), class: 'text-center' },
  { key: 'integrateSystemName', label: t('filters.gateway'), class: 'text-center' },
  { key: 'transactionDate', label: t('filters.date'), class: 'text-center' },
  { key: 'actions', label: t('filters.action'), class: 'text-center' }
])

async function getBranches() {
  props.filterData.organizationBranchId = 0
  const data = await branchStore.getBranches()
  if(data[0].name === 'Все') data[0].name = 'Все филиалы'
  branches.value = data
}

async function getList() {
  try {
    loading.value = true
    props.filterData.countInfo = null
    const cardNumber = props.filterData?.pan ? props.filterData.pan?.replace(/\s/g, '') : null

    const data = await transactionStore.getTransactions({
      pan: cardNumber,
      Fio: props.filterData?.fio,
      ext: props.filterData?.ext,
      RefNum: props.filterData?.refNum,
      Pinfl: props.filterData?.pinfl || null,
      StartDate: props.filterData?.startDate,
      EndDate: props.filterData?.endDate,
      GateType: props.filterData?.cardGateType,
      wclientType: props.filterData?.wclientType,
      OrganizationId: props.filterData?.organizationId,
      ContractLoanId: props.filterData?.contractLoanId,
      TransactionState: props.filterData?.transactionState,
      IntegrationSystemId: props.filterData?.integrationSystemId,
      OrganizationBranchId: props.filterData?.organizationBranchId,
      CurrentPage: props.filterData?.pagination.page,
      PerPage: props.filterData?.pagination.rowsPerPage
    })

    rows.value = data
    props.filterData.countInfo = transactionStore.countInfo
    props.filterData.infoState = props.filterData?.transactionState
    props.filterData.pagination.rowsNumber = transactionStore.totalPages
    props.filterData.pagination.totalCount = transactionStore.totalCount

    numerationIndex.value = (props.filterData?.pagination.page - 1) * props.filterData?.pagination.rowsPerPage

    signIndex()
  } finally {
    loading.value = false
  }
}

const signIndex = () => {
  if (rows.value?.length) {
    rows.value.forEach((row: any, index: any) => {
      row._rowVariant = row.transactionState === 2 ? 'error-line' : ''
      if (props.filterData?.pagination.page === 1) row.index = index + 1
      else row.index = numerationIndex.value + index + 1
    })
  }
}

async function downloadExcel() {
  try {
    loadBtn.value = true

    const data = await transactionStore.downloadTransactions({
      Fio: props.filterData?.fio,
      Pinfl: props.filterData?.pinfl || null,
      RefNum: props.filterData?.refNum,
      StartDate: props.filterData?.startDate,
      EndDate: props.filterData?.endDate,
      GateType: props.filterData?.cardGateType,
      OrganizationId: props.filterData?.organizationId,
      ContractLoanId: props.filterData?.contractLoanId,
      TransactionState: props.filterData?.transactionState,
      OrganizationBranchId: props.filterData?.organizationBranchId,
    })

    exportRef.value.download(data)
  } finally {
    loadBtn.value = false
  }
}

onMounted(async () => {
  await getBranches()
  await getList()
})
</script>

<template src="./template.html"></template>
